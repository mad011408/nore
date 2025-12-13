import { customProvider } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { withTracing } from "@posthog/ai";
import PostHogClient from "@/app/posthog";
import type { SubscriptionTier } from "@/types";

// Custom API configuration
const CUSTOM_API_KEY = process.env.CUSTOM_API_KEY || "sk_cr_5TfD2yaX7Do6sa4qt5NnWwH4YfpeT4nUmAE9PEeUrsPS";
const CUSTOM_API_BASE_URL = process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:5000/v1";

// Create custom OpenAI-compatible provider
const customOpenAI = createOpenAI({
  apiKey: CUSTOM_API_KEY,
  baseURL: CUSTOM_API_BASE_URL,
});

// All available models - using custom API only
// Use .chat() to force Chat Completions API instead of Responses API
const baseProviders = {
  // Main models
  "claude-opus-4-5": customOpenAI.chat("claude-opus-4-5-20251101"),
  "gemini-3-pro": customOpenAI.chat("gemini-3-pro-preview"),
  "gpt-5.2-pro": customOpenAI.chat("gpt-5.2-pro"),
  "gpt-5.2-thinking": customOpenAI.chat("GPT-5.2 Thinking (xhigh)"),

  // Aliases for internal use (all point to claude-opus-4-5)
  "ask-model": customOpenAI.chat("claude-opus-4-5-20251101"),
  "ask-model-free": customOpenAI.chat("claude-opus-4-5-20251101"),
  "ask-vision-model": customOpenAI.chat("claude-opus-4-5-20251101"),
  "ask-vision-model-for-pdfs": customOpenAI.chat("claude-opus-4-5-20251101"),
  "agent-model": customOpenAI.chat("claude-opus-4-5-20251101"),
  "agent-vision-model": customOpenAI.chat("claude-opus-4-5-20251101"),
  "title-generator-model": customOpenAI.chat("claude-opus-4-5-20251101"),
  "summarization-model": customOpenAI.chat("claude-opus-4-5-20251101"),
};

export type ModelName = keyof typeof baseProviders;

// Model display names for UI
export const modelDisplayNames: Record<string, string> = {
  "claude-opus-4-5": "Claude Opus 4.5",
  "gemini-3-pro": "Gemini 3 Pro",
  "gpt-5.2-pro": "GPT-5.2 Pro",
  "gpt-5.2-thinking": "GPT-5.2 Thinking (xhigh)",
};

// Available models for user selection
export const availableModels = [
  { id: "claude-opus-4-5", name: "Claude Opus 4.5" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro" },
  { id: "gpt-5.2-pro", name: "GPT-5.2 Pro" },
  { id: "gpt-5.2-thinking", name: "GPT-5.2 Thinking (xhigh)" },
] as const;

export const modelCutoffDates: Record<ModelName, string> = {
  "claude-opus-4-5": "December 2025",
  "gemini-3-pro": "December 2025",
  "gpt-5.2-pro": "December 2025",
  "gpt-5.2-thinking": "December 2025",
  "ask-model": "December 2025",
  "ask-model-free": "December 2025",
  "ask-vision-model": "December 2025",
  "ask-vision-model-for-pdfs": "December 2025",
  "agent-model": "December 2025",
  "agent-vision-model": "December 2025",
  "title-generator-model": "December 2025",
  "summarization-model": "December 2025",
};

export const getModelCutoffDate = (modelName: ModelName): string => {
  return modelCutoffDates[modelName] || "December 2025";
};

export const myProvider = customProvider({
  languageModels: baseProviders,
});

export const createTrackedProvider = (
  userId?: string,
  conversationId?: string,
  subscription?: SubscriptionTier,
  phClient?: ReturnType<typeof PostHogClient> | null,
) => {
  // Skip tracing for simplicity - just return the base provider
  if (!phClient || subscription === "free") {
    return myProvider;
  }

  const trackedModels: Record<string, any> = {};

  Object.entries(baseProviders).forEach(([modelName, model]) => {
    trackedModels[modelName] = withTracing(model, phClient, {
      ...(userId && { posthogDistinctId: userId }),
      posthogProperties: {
        modelType: modelName,
        ...(conversationId && { conversationId }),
        subscriptionTier: subscription,
      },
      posthogPrivacyMode: true,
    });
  });

  return customProvider({
    languageModels: trackedModels,
  });
};
