import { AbstractEval, EvalResult } from "../AbstractEval";

type ReadabilityParams = {
  html: string;
  audience: string;
  instructions?: string;
};

const INSTRUCTIONS = `
Assess reading level and clarity for target audience, 

Is this html content readable and appropriate for a general audience? 
Suggest any sentences that could be made clearer or simpler
`;

class Readability extends AbstractEval<ReadabilityParams> {
  async run(params?: ReadabilityParams | undefined): Promise<EvalResult> {
    const prompt = `
    ${this.params?.instructions ? this.params.instructions : INSTRUCTIONS}
    
    Target Audience: ${this.params?.audience}

    Html Content: ###
    
    ${this.params?.html}

    ###

    Only respond in json, with the following format: 
    {"result": "good|medium|bad|", "reason": string, rating: number  }
    `;

    return await super.generateObject(prompt);
  }
}

export default Readability;
