import { LanguageModelV1 } from "ai";
import ToneOfVoice from "./editorial/toneofvoice";
import Readability from "./editorial/readability";

export default class EditorialEvals {
  systemPrompt: string = "You read copy, its cool";
  model: any;
  scraper: any;

  constructor(model: LanguageModelV1, scraper: any, systemPrompt?: string) {
    this.model = model;
    this.scraper = scraper;

    if (systemPrompt) this.systemPrompt = systemPrompt;

    this.toneOfVoice = new ToneOfVoice(this.model, this.systemPrompt);
    this.readability = new Readability(this.model, this.systemPrompt);
  }

  toneOfVoice: ToneOfVoice;
  readability: Readability;
}

// readability
// redundant content
// bias and inclusivity checks
// content emotion
// freshness of content
// spam / overoptimisation
