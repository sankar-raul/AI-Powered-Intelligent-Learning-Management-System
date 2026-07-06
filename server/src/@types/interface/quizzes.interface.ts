import { Types } from "mongoose";

interface IQuiz {
    _id?: Types.ObjectId,
    subjectId: Types.ObjectId,
    topicId: Types.ObjectId,
    title: String,
    questions: [{
        question: String,
        oprtions: [String],
        answer: String,
        explanation: String
    }]
}

export default IQuiz