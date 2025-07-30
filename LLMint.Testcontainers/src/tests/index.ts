import { generateText, LanguageModelV1Prompt } from "ai";
import { DockerModelRunnerContainer } from "../docker-model-runner";

async function run() {
  const dmr = await new DockerModelRunnerContainer()
    .withModel("ai/smollm3")
    .start();

  const response = await generateText({
    model: dmr.getLanguageModel(),
    prompt: "tell me a joke",
    system: "you are a very funny comedian",
  });

  console.log(response);
}

run();
