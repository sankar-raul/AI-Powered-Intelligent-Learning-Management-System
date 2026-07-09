import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { cleanText } from "./textCleaner.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = undefined as any;

export interface FileContent {
  page_number: number | null;
  text: string;
}

export async function loadPdf(file: File): Promise<FileContent[]> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pages: FileContent[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const textContent = await page.getTextContent();

    const text = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");

    pages.push({
      page_number: pageNum,
      text: cleanText(text),
    });
  }

  return pages;
}

export async function loadDocx(file: File): Promise<FileContent[]> {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer,
  });

  return [
    {
      page_number: null,
      text: cleanText(result.value),
    },
  ];
}

export async function loadTxt(file: File): Promise<FileContent[]> {
  const text = await file.text();

  return [
    {
      page_number: null,
      text: cleanText(text),
    },
  ];
}

type Loader = (file: File) => Promise<FileContent[]>;

const loaders: Record<string, Loader> = {
  pdf: loadPdf,
  docx: loadDocx,
  txt: loadTxt,
};

export async function loadFile(
  file: File,
  documentType: keyof typeof loaders,
): Promise<FileContent[]> {
  const loader = loaders[documentType];

  if (!loader) {
    throw new Error(`Unsupported document type: ${documentType}`);
  }

  return loader(file);
}
