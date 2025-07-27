import { LanguageModelV1 } from "ai";

export abstract class AbstractEvalCollection {
  readonly model: LanguageModelV1;
  abstract readonly systemPrompt: string;

  constructor(model: LanguageModelV1) {
    this.model = model;
  }
}
