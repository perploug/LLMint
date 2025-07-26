import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

class ValidateIntent extends AbstractEval<EvalParams> {
  instructions = `
        you review the provided content and determine if it matches the intent and expectations of a given 
        persona that you are instructed to be. 
        `;
}

export default ValidateIntent;
