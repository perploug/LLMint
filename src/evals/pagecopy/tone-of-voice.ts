import { AbstractEval, EvalResult } from "../AbstractEval";

type toneOfVoiceParams = {
  url: string;
  selector?: string;
  filter?: string;
  styleguide: string;
  instructions?: string;
};

class ToneOfVoice extends AbstractEval<toneOfVoiceParams> {
  async run(params?: toneOfVoiceParams | undefined): Promise<EvalResult> {
    this.scraper;

    return await super.generateObject("hey hey");
  }
}

export default ToneOfVoice;
