import { Worker } from "bullmq";
import connection from "@/config/redis.js";
import RoadMapService from "@/services/roadmap.service.js";
import StudyNotesRepository from "@/repositories/studynotes.repository.js";
import SubjectRepository from "@/repositories/subject.repository.js";
import PineConeService from "@/services/pinecone.service.js";

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
