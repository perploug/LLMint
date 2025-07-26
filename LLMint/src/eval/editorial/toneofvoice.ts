import { AbstractEval } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

type ToneOfVoiceParams = EvalParams & {
  styleguide: string;
};

class ToneOfVoice extends AbstractEval<ToneOfVoiceParams> {
  instructions: string = `Evaluate the tone of this html content and determine if it has a good/medium/bad adherence to the styleguide and a rating from 0-100`;

  async createPrompt(): Promise<Array<{ key: string; prompt: string }>> {
    const pa = await super.createPrompt();

    if (this.params) {
      pa.push({
        key: "styleguide",
        prompt: `Styleguide: ###

    ${this.params.styleguide}
    
    ###`,
      });
    }

    return pa;
  }
}

export default ToneOfVoice;
