import { AbstractEval, EvalResult } from "../AbstractEval";

type RedundantAndDublicatesParams = {
  html: string;
  styleguide: string;
  instructions?: string;
};

const INSTRUCTIONS = `Detect repeated or overly similar blocks within the html cotnent

Analyze this html content for any duplication or unnecessary repetition of editorial content. 

Provide short suggestions if there a more concise way to present it.

Repeated and similiar content is reason for a worse rating. 
`;

class RedundantAndDublicates extends AbstractEval<RedundantAndDublicatesParams> {
  async run(
    params?: RedundantAndDublicatesParams | undefined
  ): Promise<EvalResult> {
    const prompt = `
    ${this.params?.instructions ? this.params.instructions : INSTRUCTIONS}

    Html Content: ###
    
    ${this.params?.html}

    ###

    Only respond in json, with the following format: 
    {"result": "good|medium|bad|", "reason": string, "rating": number, "suggestions": array<string>  }
    `;

    return await super.generateObject(prompt);
  }
}

export default RedundantAndDublicates;
