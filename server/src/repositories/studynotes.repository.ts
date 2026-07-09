import IStudynotes from "@/@types/interface/studynotes.interface.js";
import StudynotesModel from "@/models/studynotes/studynotes.model.js";

class StudyNotesRepository {
  public static async createStudyNotes(notes: IStudynotes[]): Promise<void> {
    try {
      const newStudyNotes = await StudynotesModel.insertMany(notes);
    } catch (error) {
      console.error("Error creating study notes:", error);
      throw error;
    }
  }
  public static async getStudyNotesBySubjectId(
    subjectId: string,
    filters?: Partial<IStudynotes>,
  ): Promise<IStudynotes[]> {
    try {
      const query: any = { subjectId, ...filters };
      const studyNotes = await StudynotesModel.find(query)
        .populate("file_info")
        .exec();
      return studyNotes;
    } catch (error) {
      console.error("Error fetching study notes by subject ID:", error);
      throw error;
    }
  }
  public static async getStudyNotesByFileIdAndUploadedBy(
    fileId: string,
    uploadedBy: string,
  ): Promise<IStudynotes | null> {
    try {
      const studyNotes = await StudynotesModel.findOne({
        file_id: fileId,
        uploadedBy: uploadedBy,
      }).exec();
      return studyNotes;
    } catch (error) {
      console.error(
        "Error fetching study notes by file ID and uploadedBy:",
        error,
      );
      throw error;
    }
  }
}

export default StudyNotesRepository;
