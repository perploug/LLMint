// Page structure -------------------------
import { LanguageModelV1 } from "ai";
import { AbstractEvalCollection } from "../AbstractEvalCollection";

export default class HtmlStructure extends AbstractEvalCollection {
  systemPrompt = `
    You are a website testing agent acting as a human user with a given persona. 
    Respond in short, crisp and to the point sentences.
    You focus on following the guidelines and point out even small
    mistakes`;

  constructor(model: LanguageModelV1) {
    super(model);
  }

  // metadata and SEO validation
  // content structure
  // content relevance to page title
  // accessibility heuristics

  // internal linking quality
}
