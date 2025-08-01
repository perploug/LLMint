import { LanguageModelV1 } from "ai";
import ToneOfVoice from "./toneofvoice";
import Readability from "./readability";
import BiasInclusivity from "./bias-inclusivity";
import RedundantAndDublicates from "./redundant-dublicate";
import { AbstractEvalCollection } from "../AbstractEvalCollection";

export default class Editorial extends AbstractEvalCollection {
  systemPrompt: string = `
    You are an editorial agent, you review the provided content for common web content issues 
    and always provide a rating of the content according to the instructions,
    as well as a clear reason and suggestions for improvements
    
    Respond in short, crisp and to the point sentences.`;

  //You focus on following the guidelines and point out even small mistakes.

  constructor(model: LanguageModelV1) {
    super(model);

    this.toneOfVoice = new ToneOfVoice(this.model, this.systemPrompt);
    this.readability = new Readability(this.model, this.systemPrompt);
    this.biasInclusivity = new BiasInclusivity(this.model, this.systemPrompt);
    this.redundantDublicate = new RedundantAndDublicates(
      this.model,
      this.systemPrompt
    );
  }

  toneOfVoice: ToneOfVoice;
  readability: Readability;
  biasInclusivity: BiasInclusivity;
  redundantDublicate: RedundantAndDublicates;
}

// content emotion
// freshness of content
// spam / overoptimisation
