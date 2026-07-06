import { Types } from "mongoose"

interface IQuizAttempts {
    _id?: String,
    studentId: Types.ObjectId,
    quizId: Types.ObjectId,
    score: number,
    answers: [String],
    submittedAt: Date
}

export default IQuizAttempts