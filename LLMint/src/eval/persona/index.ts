import { LanguageModelV1 } from "ai";
import ValidateIntent from "./validateIntent";
import { AbstractEvalCollection } from "../AbstractEvalCollection";

export default class Persona extends AbstractEvalCollection {
  systemPrompt = `
    You are a website testing agent acting as a human user with a given persona. 
    Respond in short, crisp and to the point sentences.
    You focus on following the guidelines and point out even small
    mistakes`;

  constructor(model: LanguageModelV1) {
    super(model);
    this.validateIntent = new ValidateIntent(this.model, this.systemPrompt);
  }

  validateIntent: ValidateIntent;
}

// content emotion
// freshness of content
// spam / overoptimisation
