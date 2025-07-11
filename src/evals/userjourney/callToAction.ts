import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

class CallToAction extends AbstractEval<EvalParams> {
  instructions: string = `Ensure CTAs are clear, action-oriented, and not confusing

Are the calls to action in this page clear and compelling? 
Suggest improvements to clarity, action verbs, or placement

If intent, expectation, or a persona is provided, take this into account
when evaluated the CTA compared to the content. 
`;
}

export default CallToAction;
