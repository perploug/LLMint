import {
  createOpenAICompatible,
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleChatSettings,
} from "@ai-sdk/openai-compatible";
import { LanguageModelV1 } from "ai";

const dmr = function (
  modelName = "ai/qwen3",
  baseUrl = "http://localhost:12434"
) {
  const model = new OpenAICompatibleChatLanguageModel(
    modelName,
    {},
    {
      supportsStructuredOutputs: true,
      defaultObjectGenerationMode: "json",
      headers: () => ({}),
      provider: `docker-model-runner`,
      url: ({ path }) => {
        const url = new URL(`${baseUrl}/engines/v1${path}`);
        return url.toString();
      },
    }
  );

  return model;
};

export default dmr;
