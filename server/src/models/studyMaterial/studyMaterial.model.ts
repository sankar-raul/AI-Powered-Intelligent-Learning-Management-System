import IStudyNotes from "@/@types/interface/studynotes.interface.js";
import { model } from "mongoose";
import StudyMaterialSchema from "./studyMaterial.schema.js";

const StudyMaterialModel = model<IStudyNotes>("studyMaterials", StudyMaterialSchema);

export default StudyMaterialModel;
