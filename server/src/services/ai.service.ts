import OpenAI from "openai";
const ai_end = "http://127.0.0.1:7777/v1";
const client = new OpenAI({
  apiKey: "not-needed",
  baseURL: ai_end,
});
export interface IConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
class AiService {
  public static async json(prompt: string): Promise<object> {
    const response = await client.chat.completions.create({
      model: "local",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const json = await JSON.parse(response.choices[0].message.content!);
    return json;
  }
  public static async text(
    prompt: string,
    conversationsMessages: IConversationMessage[] = [],
  ): Promise<string> {
    const response = await client.chat.completions.create({
      model: "local",
      messages: conversationsMessages,
    });
    const text = response.choices[0].message.content!;
    return text;
  }
}

export default AiService;
