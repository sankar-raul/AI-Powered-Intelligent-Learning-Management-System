import ISubject from "@/@types/interface/subject.interface.js";
import SubjectModel from "@/models/subjects/subject.model.js";

class SubjectRepository {
  public static async createSubject(subject: ISubject): Promise<any> {
    const newSubject = new SubjectModel(subject);
    return await newSubject.save();
  }
  public static async getSubjectById(
    subjectId: string,
  ): Promise<ISubject | null> {
    return await SubjectModel.findById(subjectId).exec();
  }
  public static async updateSubject(
    subjectId: string,
    updateData: Partial<ISubject>,
  ): Promise<ISubject | null> {
    return await SubjectModel.findByIdAndUpdate(subjectId, updateData, {
      new: true,
    }).exec();
  }
  public static async deleteSubject(
    subjectId: string,
  ): Promise<ISubject | null> {
    return await SubjectModel.findByIdAndDelete(subjectId).exec();
  }
  public static async getAllSubjects(): Promise<ISubject[]> {
    return await SubjectModel.find().exec();
  }
  public static async getSubjectsByTeacherId(
    teacherId: string,
  ): Promise<ISubject[]> {
    return await SubjectModel.find({ teacher_id: teacherId }).exec();
  }
}

export default SubjectRepository;
