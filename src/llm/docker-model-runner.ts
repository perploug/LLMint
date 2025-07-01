import {
  createOpenAICompatible,
  OpenAICompatibleChatSettings,
} from "@ai-sdk/openai-compatible";
//import isDocker from "is-docker";

const dmr = function (model = "ai/qwen3") {
  // this needs more internal logic if docker is not DD, but Docker Engine

  let baseUrl = "http://localhost:12434/engines/v1";
  //if (isDocker()) {
  //  baseUrl = "http://model-runner.docker.internal/";
  //}

  const dmr = createOpenAICompatible({
    name: "docker-model-runner",
    apiKey: "none",
    baseURL: baseUrl,
  });

  return dmr(model);
};

export default dmr;
