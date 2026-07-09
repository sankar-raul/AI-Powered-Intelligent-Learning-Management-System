import IDocument from "@/@types/interface/document.interface.js";
import DocumentModel from "@/models/document/document.model.js";
import StudyNotesRepository from "./studynotes.repository.js";

class DocumentRepository {
  public static async createDocument(
    document: IDocument,
    user_id: string,
  ): Promise<IDocument> {
    const existingDocument = await DocumentModel.findOne({
      file_fingerprint: document.file_fingerprint,
    });
    if (existingDocument) {
      const duplicateUser =
        await StudyNotesRepository.getStudyNotesByFileIdAndUploadedBy(
          existingDocument._id!.toString(),
          user_id,
        );
      if (duplicateUser) {
        throw new Error(
          "You have already uploaded a document with the same content.",
        );
      } else {
        // increment
        existingDocument.file_users_count =
          existingDocument.file_users_count || 1 + 1;
        existingDocument.save();
      }
      return existingDocument;
    }
    const newDocument = new DocumentModel({
      ...document,
      file_users_count: 1,
    });
    return await newDocument.save();
  }
  public static async getDocumentById(
    documentId: string,
  ): Promise<IDocument | null> {
    return await DocumentModel.findById(documentId).exec();
  }
  public static async updateDocument(
    documentId: string,
    updateData: Partial<IDocument>,
  ): Promise<IDocument | null> {
    return await DocumentModel.findByIdAndUpdate(documentId, updateData, {
      new: true,
    }).exec();
  }
  public static async deleteDocument(
    documentId: string,
  ): Promise<IDocument | null | undefined> {
    // Decrement the count before deleting
    const document = await DocumentModel.findById(documentId).exec();
    if (document) {
      if (document.file_users_count > 1) {
        document.file_users_count -= 1;
        await document.save();
        return document; // Return the updated document without deleting
      } else {
        return await DocumentModel.findByIdAndDelete(documentId).exec();
      }
    }
  }
}

export default DocumentRepository;
