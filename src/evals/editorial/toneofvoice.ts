import { AbstractEval, EvalResult } from "../AbstractEval";

type ToneOfVoiceParams = {
  html: string;
  styleguide: string;
  instructions?: string;
};

const INSTRUCTIONS = `Evaluate the tone of this html content `;

class ToneOfVoice extends AbstractEval<ToneOfVoiceParams> {
  async run(params?: ToneOfVoiceParams | undefined): Promise<EvalResult> {
    const prompt = `
    ${this.params?.instructions ? this.params.instructions : INSTRUCTIONS}
    
    Styleguide: ###

    ${this.params?.styleguide}
    
    ###

    Review this html and determine if it has a good/medium/bad adherence to the styleguide and a rating from 0-100

    Html: ###
    
    ${this.params?.html}

    ###

    Only respond in json, with the following format: 
    {"result": "good|medium|bad|", "reason": string, rating: number  }
    `;

    return await super.generateObject(prompt);
  }
}

export default ToneOfVoice;
