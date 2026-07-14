import { Worker } from "bullmq";
import connection from "@/config/redis.js";
import RoadMapService from "@/services/roadmap.service.js";
import StudyNotesRepository from "@/repositories/studynotes.repository.js";
import SubjectRepository from "@/repositories/subject.repository.js";
import PineConeService from "@/services/pinecone.service.js";
import RoadmapRepository from "@/repositories/roadmap.repositories.js";
import quizQueue from "@/queues/quiz.queue.js";

export const subjectWorker = new Worker(
  "process-subject",
  async (job) => {
    console.log(job.name);
    const subject_id = job.data.subject_id;
    console.log(job.data.subject_id);
    console.log("😊😊😊");
    // TODO
    const [documents, seubject] = await Promise.all([
      StudyNotesRepository.getStudyNotesBySubjectId(subject_id),
      SubjectRepository.getSubjectById(subject_id),
    ]);
    const syllabus = documents.find(
      (doc) => doc.file_info?.doc_role === "SYLLABUS",
    );
    const notes = documents.filter(
      (doc) => doc.file_info?.doc_role === "NOTES",
    );
    console.log("Generating roadmap for subject:", seubject?.title);
    await RoadMapService.generateRoadMap(subject_id, {
      notes,
      syllabus,
      subject_name: seubject?.title as string,
    });

    // Queue quiz generation for all roadmap topics
    try {
      const roadmaps = await RoadmapRepository.getRoadmapsBySubjectId(subject_id);
      if (roadmaps && roadmaps.length > 0) {
        const generatedRoadmap = roadmaps[0];
        const quizJobs = [];
        for (const unit of generatedRoadmap.units || []) {
          for (const topic of unit.topics || []) {
            quizJobs.push(
              quizQueue.add("generate-quiz", {
                subject_id: subject_id,
                topic_id: topic._id!.toString(),
                topic_title: topic.title as string,
                topic_description: topic.description as string,
              })
            );
          }
        }
        await Promise.all(quizJobs);
        console.log(`[Subject Worker] Queued ${quizJobs.length} quiz generation jobs.`);
      }
    } catch (err) {
      console.error("[Subject Worker] Error queueing quizzes:", err);
    }

    console.log("chunking...");
    await Promise.all(
      notes.map((note) =>
        PineConeService.process(
          JSON.parse(note.file_info?.text_data as string),
          note._id!.toString(),
          subject_id,
          note.title as string,
        ),
      ),
    );
    // Load documents
    // Generate roadmap
    // Save roadmap
  },
  {
    connection,
    concurrency: 2,
  },
);

subjectWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

subjectWorker.on("failed", (job, err) => {
  console.error(job?.id, err);
});
