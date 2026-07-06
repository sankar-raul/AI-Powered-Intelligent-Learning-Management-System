const AI_UNAVAILABLE_MESSAGE =
  "AI processing is currently unavailable, but manual creation/editing remains supported.";

const aiService = {
  async generateRoadmapDraft() {
    throw new Error(AI_UNAVAILABLE_MESSAGE);
  },
  async generateQuizDraft() {
    throw new Error(AI_UNAVAILABLE_MESSAGE);
  },
  async answerTopicQuestion(question: string) {
    return {
      answer: `AI fallback response: ${question}`,
      source: "fallback",
    };
  },
};

export default aiService;
