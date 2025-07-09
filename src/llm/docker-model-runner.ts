import {
  createOpenAICompatible,
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleChatSettings,
} from "@ai-sdk/openai-compatible";
import { LanguageModelV1 } from "ai";
//import isDocker from "is-docker";

const dmr = function (modelName = "ai/qwen3") {
  // this needs more internal logic if docker is not DD, but Docker Engine

  let baseUrl = "http://localhost:12434/engines/v1";
  //if (isDocker()) {
  //  baseUrl = "http://model-runner.docker.internal/";
  //}
  /*
  const dmr = createOpenAICompatible({
    name: "docker-model-runner",
    apiKey: "none",
    baseURL: baseUrl,
  });
  */

  const model = new OpenAICompatibleChatLanguageModel(
    modelName,
    {},
    {
      supportsStructuredOutputs: true,
      defaultObjectGenerationMode: "json",
      headers: () => ({}),
      provider: `docker-model-runner`,
      url: ({ path }) => {
        const url = new URL(`http://localhost:12434/engines/v1${path}`);
        return url.toString();
      },
    }
  );

  return model;
};

export default dmr;
