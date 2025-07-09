import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

type ReadabilityParams = EvalParams & {
  audience: string;
};

class Readability extends AbstractEval<ReadabilityParams> {
  instructions = `
        Assess reading level and clarity for target audience, 

        Is this html content readable and appropriate for a general audience? 
        Suggest any sentences that could be made clearer or simpler
        `;

  async createPrompt(): Promise<Array<{ key: string; prompt: string }>> {
    const pa = await super.createPrompt();

    if (this.params) {
      pa.splice(1, 0, {
        key: "audience",
        prompt: `Target Audience: ${this.params.audience}`,
      });
    }

    return pa;
  }
}

export default Readability;
