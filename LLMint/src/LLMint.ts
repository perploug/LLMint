import { LanguageModelV1 } from "ai";
import Editorial from "./eval/editorial";
import Persona from "./eval/persona";
import UserJourney from "./eval/userjourney";

export class LLMint {
  readonly editorial: Editorial;
  readonly persona: Persona;
  readonly userJourney: UserJourney;

  readonly model: LanguageModelV1;

  constructor(model: LanguageModelV1) {
    this.model = model;

    this.editorial = new Editorial(this.model);
    this.persona = new Persona(this.model);
    this.userJourney = new UserJourney(this.model);
  }
}
