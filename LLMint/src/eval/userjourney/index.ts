import { LanguageModelV1 } from "ai";
import CallToAction from "./callToAction";
import NextSteps from "./nextSteps";
import { AbstractEvalCollection } from "../AbstractEvalCollection";

export default class UserJourney extends AbstractEvalCollection {
  systemPrompt: string = `You are a user experience agent, you review the provided content for 
                          issues with the user journey and ensure that pages take UX best practices into accounts.

                          You always provide a rating of the content according to the instructions,
                          as well as a clear reason and suggestions for improvements
                          
                          Respond in short, crisp and to the point sentences.
                                  
  You focus on following the guidelines and point out even small
          mistakes.`;

  constructor(model: LanguageModelV1 | string) {
    super(model);

    this.callToAction = new CallToAction(this.model, this.systemPrompt);
    this.nextSteps = new NextSteps(this.model, this.systemPrompt);
  }

  callToAction: CallToAction;
  nextSteps: NextSteps;
}

// content emotion
// freshness of content
// spam / overoptimisation
