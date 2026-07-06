import mongoose from "mongoose"

interface ITopic {
    _id?: mongoose.Types.ObjectId,
    title: String,
    description: String,
    order: number
}
export default ITopic