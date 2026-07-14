import { Request, Response } from "express";
import QuizeModel from "@/models/quizzes/quiz.model.js";
import quizQueue from "@/queues/quiz.queue.js";
import RoadmapRepository from "@/repositories/roadmap.repositories.js";
import mongoose from "mongoose";

export const getTopicQuiz = async (req: Request, res: Response) => {
  try {
    const { subjectId, topicId } = req.params;

    if (!subjectId || !topicId) {
      return res.status(400).json({
        message: "Missing subjectId or topicId path parameter.",
      });
    }

    // Find if quiz already exists
    const quiz = await QuizeModel.findOne({
      topicId: new mongoose.Types.ObjectId(topicId as string),
    }).exec();

    if (quiz) {
      return res.status(200).json({
        quiz,
      });
    }

    // If quiz does not exist, trigger background generation
    // First, retrieve the topic details from the roadmap to get the title and description
    const roadmaps = await RoadmapRepository.getRoadmapsBySubjectId(subjectId as string);
    if (!roadmaps || roadmaps.length === 0) {
      return res.status(404).json({
        message: "Roadmap not found for subject. Create a roadmap first.",
      });
    }

    const roadmap = roadmaps[0];
    let matchedTopic: any = null;
    for (const unit of roadmap.units || []) {
      for (const topic of unit.topics || []) {
        if (topic._id!.toString() === (topicId as string)) {
          matchedTopic = topic;
          break;
        }
      }
      if (matchedTopic) break;
    }

    if (!matchedTopic) {
      return res.status(404).json({
        message: "Topic not found inside subject roadmap.",
      });
    }

    // Add job to quiz queue
    await quizQueue.add("generate-quiz", {
      subject_id: subjectId as string,
      topic_id: topicId as string,
      topic_title: matchedTopic.title as string,
      topic_description: matchedTopic.description as string,
    });

    return res.status(202).json({
      message: "Quiz is being generated. Please check back in a few seconds.",
      generating: true,
    });
  } catch (error) {
    console.error("Error in getTopicQuiz:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error.",
    });
  }
};
