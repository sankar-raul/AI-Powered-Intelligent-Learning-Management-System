import IEnrollment from "@/@types/interface/enrollment.interface.js";
import { model } from "mongoose";
import enrollmentSchema from "./enrollment.schema.js";

const EnrollmentModel = model<IEnrollment>("enrollments", enrollmentSchema);

export default EnrollmentModel;
