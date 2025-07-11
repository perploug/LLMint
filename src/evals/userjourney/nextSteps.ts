import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

class NextSteps extends AbstractEval<EvalParams> {
  instructions: string = `Ensure the content leads users logically through next steps

Does the content guide the user clearly to a logical next action or step in their journey? Identify any gaps or unclear transitions

If intent, expectation, or a persona is provided, take this into account
when evaluated the CTA compared to the content. 
`;
}

export default NextSteps;
