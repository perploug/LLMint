// Page copy ----------------------

import { LanguageModelV1 } from "ai";
import { EvalInstance } from "./AbstractEval";
import ToneOfVoice from "./pagecopy/tone-of-voice";

export default class PageCopy {
  systemPrompt: string = "You read copy, its cool";
  model: any;
  scraper: any;

  constructor(model: LanguageModelV1, scraper: any, systemPrompt?: string) {
    this.model = model;
    this.scraper = scraper;

    if (systemPrompt) this.systemPrompt = systemPrompt;

    this.toneOfVoice = new ToneOfVoice(
      this.model,
      this.scraper,
      this.systemPrompt
    );
  }

  toneOfVoice: ToneOfVoice;
}

// tone of voice

// readability
// redundant content
// bias and inclusivity checks
// content emotion
// freshness of content
// spam / overoptimisation
