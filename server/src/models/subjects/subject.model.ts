import ISubject from "@/@types/interface/subject.interface.js";
import { model } from "mongoose";
import SubjectSchema from "./subject.schema.js";


const SubjectModel = model<ISubject>("subject", SubjectSchema)

export default SubjectModel