import { streamText, UIMessage, UIMessageStreamWriter } from "ai";
import { myProvider } from "@/lib/ai/providers";

const truncateMiddle = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  const halfLength = Math.floor((maxLength - 3) / 2); // -3 for "..."
  const start = text.substring(0, halfLength);
  const end = text.substring(text.length - halfLength);

  return `${start}...${end}`;
};

export const DEFAULT_TITLE_GENERATION_PROMPT_TEMPLATE = (
  message: string,
) => `Generate a short chat title (3-5 words only) for this message. Reply with ONLY the title, nothing else.

Message: ${truncateMiddle(message, 8000)}`;

export const generateTitleFromUserMessage = async (
  truncatedMessages: UIMessage[],
): Promise<string> => {
  const firstMessage = truncatedMessages[0];
  const textContent = firstMessage.parts
    .filter((part: { type: string; text?: string }) => part.type === "text")
    .map((part: { type: string; text?: string }) => part.text || "")
    .join(" ");

  // Use streamText and collect the full response since custom API only supports streaming
  const result = streamText({
    model: myProvider.languageModel("title-generator-model"),
    messages: [
      {
        role: "user",
        content: DEFAULT_TITLE_GENERATION_PROMPT_TEMPLATE(textContent),
      },
    ],
  });

  // Collect full text from stream
  let fullText = "";
  for await (const chunk of result.textStream) {
    fullText += chunk;
  }

  // Clean up the title - remove quotes, extra whitespace, etc.
  const cleanTitle = fullText
    .trim()
    .replace(/^["']|["']$/g, "") // Remove surrounding quotes
    .replace(/\*\*/g, "") // Remove markdown bold
    .replace(/`[^`]*`/g, "") // Remove inline code/backticks
    .split("\n")[0] // Take only first line
    .trim();

  return cleanTitle || "New Chat";
};

export const generateTitleFromUserMessageWithWriter = async (
  truncatedMessages: UIMessage[],
  writer: UIMessageStreamWriter,
): Promise<string | undefined> => {
  try {
    const chatTitle = await generateTitleFromUserMessage(truncatedMessages);

    writer.write({
      type: "data-title",
      data: { chatTitle },
      transient: true,
    });

    return chatTitle;
  } catch (error) {
    // Log error but don't propagate to keep main stream resilient
    console.error("Failed to generate or write chat title:", error);
    return undefined;
  }
};
