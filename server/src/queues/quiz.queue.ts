import { Queue } from "bullmq";
import connection from "@/config/redis.js";

export interface IProcessQuizJob {
  subject_id: string;
  topic_id: string;
  topic_title: string;
  topic_description: string;
}

export const QUIZ_QUEUE_NAME = "process-quiz";

const quizQueue = new Queue<IProcessQuizJob>(QUIZ_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 100,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
});

export default quizQueue;
