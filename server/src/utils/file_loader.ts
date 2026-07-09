import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import { cleanText } from "./textCleaner.js";

// pdfjsLib.GlobalWorkerOptions.workerSrc = undefined as any;

export interface FileContent {
  page_number: number | null;
  text: string;
}

export async function loadPdf(
  file: Express.Multer.File,
): Promise<FileContent[]> {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(file.buffer),
  }).promise;
  const pages: FileContent[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    console.log(page);

    const textContent = await page.getTextContent();

    const text = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");

    pages.push({
      page_number: pageNum,
      text: cleanText(text),
    });
  }
  console.log(file.originalname);
  console.log(pages);
  return pages;
}

export async function loadDocx(
  file: Express.Multer.File,
): Promise<FileContent[]> {
  const arrayBuffer = file.buffer;

  const result = await mammoth.extractRawText({
    arrayBuffer: arrayBuffer as unknown as ArrayBuffer,
  });

  return [
    {
      page_number: null,
      text: cleanText(result.value),
    },
  ];
}

export async function loadTxt(
  file: Express.Multer.File,
): Promise<FileContent[]> {
  const text = file.buffer.toString("utf-8");

  return [
    {
      page_number: null,
      text: cleanText(text),
    },
  ];
}

type Loader = (file: Express.Multer.File) => Promise<FileContent[]>;

const loaders: Record<string, Loader> = {
  pdf: loadPdf,
  docx: loadDocx,
  txt: loadTxt,
};

export async function loadFile(
  file: Express.Multer.File,
  documentType: keyof typeof loaders,
): Promise<FileContent[]> {
  const loader = loaders[documentType];

  if (!loader) {
    throw new Error(`Unsupported document type: ${documentType}`);
  }

  return loader(file);
}
