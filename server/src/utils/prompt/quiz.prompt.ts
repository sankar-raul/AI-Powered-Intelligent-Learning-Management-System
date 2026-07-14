const quizPrompt = ({
  topic_title,
  topic_description,
  context_text,
}: {
  topic_title: string;
  topic_description: string;
  context_text: string;
}) => `You are an expert academic evaluator, instructional designer, and educational content assessor.

Your task is to generate a high-quality, comprehensive multiple-choice checkpoint quiz for the following topic.

Topic Name: ${topic_title}
Topic Description: ${topic_description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCE CONTEXT MATERIAL (USE FOR RELEVANT AND ACCURATE QUESTIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${context_text || "No specific study note context available. Rely on standard scientific and technical facts."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generate a multiple-choice quiz consisting of exactly 5 unique questions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Generate exactly 5 questions.
2. For each question, provide exactly 4 options.
3. Make option choices challenging but clear. Avoid obvious distractor options.
4. Specify the correct answer string. The "answer" value MUST match one of the options array strings EXACTLY.
5. Provide a detailed explanation for the correct answer, explaining what the correct answer is and why the other options are incorrect.
6. The title of the quiz should be a polished academic title.
7. Return ONLY valid JSON matching the schema below.
8. Do NOT generate markdown formatting.
9. Do not include any text before or after the JSON block.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT JSON SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string",
      "explanation": "string"
    }
  ]
}

The response must be directly parsable using JSON.parse().`;

export default quizPrompt;
