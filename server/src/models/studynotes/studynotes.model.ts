import IStudynotes from "@/@types/interface/studynotes.interface.js";
import { model } from "mongoose";
import studyNotesSchema from "./studynotes.schema.js";

const StudynotesModel = model<IStudynotes>("study_notes", studyNotesSchema)

export default StudynotesModel