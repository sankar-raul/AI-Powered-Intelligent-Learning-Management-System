import ISubject from "@/@types/interface/subject.interface.js";
import SubjectRepository from "@/repositories/subject.repository.js";
import StudyNotesService from "./studyNotes.service.js";

class SubjectService {
  public static async createSubject(
    subject: ISubject,
    files: { syllabus: Express.Multer.File; notes: Express.Multer.File[] },
    user_id: string,
  ): Promise<ISubject> {
    try {
      const newSubject = await SubjectRepository.createSubject(subject);
      const subject_id = newSubject._id?.toString();
      const op = await StudyNotesService.createStudyNotes(
        {
          syllabus: files.syllabus,
          notes: files.notes,
        },
        user_id,
        subject_id,
      );
      console.log("Study notes created:", op);
      return newSubject;
    } catch (error) {
      console.error("Error creating subject:", error);

      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

export default SubjectService;
