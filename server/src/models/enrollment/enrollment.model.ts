import IEnrollment from "@/@types/interface/enrollment.interface.js";
import { model } from "mongoose";
import EnrollmentSchema from "./enrollment.schema.js";

const EnrollmentModel = model<IEnrollment>("enrollments", EnrollmentSchema);

export default EnrollmentModel;
