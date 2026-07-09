import DocumentRepository from "@/repositories/document.repository.js";
import { uploadToS3 } from "./s3.service.js";
import IDocument, {
  DocumentType,
} from "@/@types/interface/document.interface.js";
import { generateFingerprint } from "@/utils/filefingerprintGenerator.js";
import { loadFile } from "@/utils/file_loader.js";
import StudyNotesRepository from "@/repositories/studynotes.repository.js";
import IStudynotes from "@/@types/interface/studynotes.interface.js";
import getDocumentType from "@/utils/getdocumenttype.js";

class StudyNotesService {
  static async uploadFilesToS3(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    try {
      const uploadedFiles = await Promise.all(
        files.map((file) => uploadToS3(file, "NOTES")),
      );
      return uploadedFiles.map((file) => file.key);
    } catch (error) {
      console.error("Error uploading files to S3:", error);
      throw error;
    }
  }
  public static async uploadStudyNotes(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadedFileKeys = await StudyNotesService.uploadFilesToS3(files);
    return uploadedFileKeys;
  }
  public static async uploadSyllabus(
    file: Express.Multer.File,
  ): Promise<string> {
    const uploadedFile = await uploadToS3(file, "SYLLABUS");
    return uploadedFile.key;
  }
  public static async createStudyNotes(
    files: { syllabus: Express.Multer.File; notes: Express.Multer.File[] },
    user_id: string,
    subject_id: string,
  ): Promise<{ syllabus_id: string }> {
    const [syllabusKey, notesKeys] = await Promise.all([
      StudyNotesService.uploadSyllabus(files.syllabus),
      StudyNotesService.uploadStudyNotes(files.notes),
    ]);
    const syllabusDoc: IDocument = {
      doc_role: "SYLLABUS",
      file_users_count: 1,
      url: syllabusKey,
      file_fingerprint: await generateFingerprint(
        files.syllabus as unknown as Buffer<ArrayBufferLike>,
      ),
      uploadedAt: new Date(),
      size: files.syllabus.size,
      type: getDocumentType(files.syllabus) || "txt",
      text_data: JSON.stringify(await loadFile(files.syllabus, "pdf")),
    };
    const notesDocs: IDocument[] = await Promise.all(
      files.notes.map(async (noteFile) => ({
        doc_role: "NOTES",
        file_users_count: 1,
        url: notesKeys[files.notes.indexOf(noteFile)],
        file_fingerprint: await generateFingerprint(
          noteFile as unknown as Buffer<ArrayBufferLike>,
        ),
        uploadedAt: new Date(),
        size: noteFile.size,
        type: getDocumentType(noteFile) || "txt",
        text_data: JSON.stringify(await loadFile(noteFile, "pdf")),
      })),
    );
    const [syllabus, ...notes] = await Promise.all([
      DocumentRepository.createDocument(syllabusDoc, user_id),
      ...notesDocs.map((note) =>
        DocumentRepository.createDocument(note, user_id),
      ),
    ]);
    const uploadedStudyNotes = await StudyNotesRepository.createStudyNotes(
      notes.map((note, _idx) => ({
        file_id: note._id?.toString()!,
        title: files.notes[_idx].originalname,
        subjectId: subject_id,
        uploadedAt: new Date(),
        uploadedBy: user_id,
      })),
    );
    const uploadedSyllabus = await StudyNotesRepository.createStudyNotes([
      {
        file_id: syllabus._id?.toString()!,
        title: files.syllabus.originalname,
        subjectId: subject_id,
        uploadedAt: new Date(),
        uploadedBy: user_id,
      },
    ]);
    return { syllabus_id: syllabus._id?.toString()! };
  }
}

export default StudyNotesService;
