import { LanguageModelV1 } from "ai";
import dmr from "../llm/docker-model-runner";

export abstract class AbstractEvalCollection {
  readonly model: LanguageModelV1;
  abstract readonly systemPrompt: string;

  constructor(model: LanguageModelV1 | string) {
    if (typeof model === "string") {
      this.model = dmr(model as string);
    } else {
      this.model = model as LanguageModelV1;
    }
  }
}
