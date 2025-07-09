import { AbstractEval, EvalResult } from "../AbstractEval";
import { EvalParams } from "../EvalParams";

class BiasInclusivity extends AbstractEval<EvalParams> {
  instructions = `
    Identify biased, non-inclusive, or insensitive language,
    Scan this content for language that could be considered biased, non-inclusive, or insensitive. Suggest revisions.
    `;
}

export default BiasInclusivity;
