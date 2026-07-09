import { Queue } from "bullmq";
import connection from "@/config/redis.js";

export interface IProcessSubjecctJob {
  subject_id: string;
}

export const SUBJECT_QUEUE_NAME = "process-subject";

const subjectQueue = new Queue<IProcessSubjecctJob>(SUBJECT_QUEUE_NAME, {
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
export default subjectQueue;
