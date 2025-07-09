import { LanguageModelV1 } from "ai";
import ValidateIntent from "./validateIntent";

export default class PersonaEvals {
  systemPrompt: string = `You are a website testing agent acting as a human user with a given persona. 
                          
                          Respond in short, crisp and to the point sentences.

                         
                          `;

  // You are extremely critical of insuring the content lives up the intent and expectatons
  //                    of the persona and point out even the smallest mistakes.

  model: LanguageModelV1;

  constructor(model: LanguageModelV1, systemPrompt?: string) {
    this.model = model;

    if (systemPrompt) this.systemPrompt = systemPrompt;

    this.validateIntent = new ValidateIntent(this.model, this.systemPrompt);
  }

  validateIntent: ValidateIntent;
}

// content emotion
// freshness of content
// spam / overoptimisation
