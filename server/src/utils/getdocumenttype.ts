import { DocumentType } from "@/@types/interface/document.interface.js";

function getDocumentType(file: Express.Multer.File): DocumentType | undefined {
  const ext = file.originalname.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return "pdf";
    case "docx":
      return "docx";
    case "txt":
      return "txt";
    default:
      throw new Error("Unsupported file type");
  }
}

export default getDocumentType;
