import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

class RedundantAndDublicates extends AbstractEval<EvalParams> {
  instructions: string = `Detect repeated or overly similar blocks within the html cotnent

Analyze this html content for any duplication or unnecessary repetition of editorial content. 
Provide short suggestions if there a more concise way to present it.
Repeated and similiar content is reason for a worse rating. 
`;
}

export default RedundantAndDublicates;
