import { Worker } from "bullmq";
import connection from "@/config/redis.js";
import PineConeService from "@/services/pinecone.service.js";
import AiService from "@/services/ai.service.js";
import quizPrompt from "@/utils/prompt/quiz.prompt.js";
import QuizeModel from "@/models/quizzes/quiz.model.js";
import mongoose from "mongoose";

export const quizWorker = new Worker(
  "process-quiz",
  async (job) => {
    const { subject_id, topic_id, topic_title, topic_description } = job.data;
    console.log(`[Quiz Worker] Generating quiz for topic: ${topic_title} (ID: ${topic_id})`);

    let context_text = "";
    try {
      // Query Pinecone for context chunks matching the topic title
      const hits = await PineConeService.searchChunks(topic_title, 5, {
        subject_id: subject_id as any,
      } as any);

      if (hits && Array.isArray(hits)) {
        context_text = hits
          .map((hit: any) => {
            const record = hit.record || hit;
            const fields = record.fields || record;
            return fields.text || fields.chunk_text || "";
          })
          .filter(Boolean)
          .join("\n\n");
      }
    } catch (err) {
      console.warn(`[Quiz Worker] Pinecone context search failed, proceeding with generic generation:`, err);
    }

    // Call AiService to generate 5 JSON questions
    const prompt = quizPrompt({
      topic_title,
      topic_description,
      context_text,
    });

    const aiResponse = (await AiService.json(prompt)) as any;
    
    // Validate AI response shape and map answers
    if (!aiResponse || !aiResponse.questions || !Array.isArray(aiResponse.questions)) {
      throw new Error("Invalid AI generated quiz response structure.");
    }

    const quizQuestions = aiResponse.questions.map((q: any) => {
      return {
        question: q.question || "",
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        answer: q.answer || "",
        explanation: q.explanation || "",
      };
    });

    // Create the Quiz record in database
    const quizData = {
      subjectId: new mongoose.Types.ObjectId(subject_id),
      topicId: new mongoose.Types.ObjectId(topic_id),
      title: aiResponse.title || `${topic_title} Checkpoint Quiz`,
      questions: quizQuestions,
    };

    // Save to MongoDB (use findOneAndUpdate with upsert to prevent duplicates)
    await QuizeModel.findOneAndUpdate(
      { topicId: new mongoose.Types.ObjectId(topic_id) },
      quizData,
      { upsert: true, new: true }
    );

    console.log(`[Quiz Worker] Successfully generated and saved quiz for topic: ${topic_title}`);
  },
  {
    connection,
    concurrency: 2,
  }
);

quizWorker.on("completed", (job) => {
  console.log(`[Quiz Worker] Job ${job.id} completed successfully.`);
});

quizWorker.on("failed", (job, err) => {
  console.error(`[Quiz Worker] Job ${job?.id} failed:`, err);
});
