import LLmint from "llmint";
import { HtmlContentGenerator } from "llmint/dist/generator/htmlContent";
import { DockerModelRunnerContainer } from "./docker-model-runner";
import { createOpenAI } from "@ai-sdk/openai";

require("dotenv").config();

async function run() {
  console.time();
  const dmr = await new DockerModelRunnerContainer("alpine/socat:latest")
    .withModel("ai/qwen3")
    .start();

  console.log("dmr qwen 3 started");
  console.timeEnd();

  const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: "strict", // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_KEY,
  });
  const llm = openai("gpt-4-turbo");

  //const llm = dmr.getLanguageModel();

  console.time();

  const llmint = new LLmint(llm);
  const html = new HtmlContentGenerator(llm);
  console.log("llmint up");
  console.timeEnd();

  console.time();
  const ht = await html.generate({ instructions: "give me some cool html" });
  console.log(ht);

  console.log("html gen done");
  console.timeEnd();
}

run();
