import { Request } from "express";
import { Multer } from "multer";

export interface MulterRequest extends Request {
  file?: Multer.File;
}