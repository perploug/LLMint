import { generateObject, LanguageModelV1 } from "ai";
import { z } from "zod";
import { EvalParams, FetchParams } from "./EvalParams";
var HTMLParser = require("node-html-parser");

const EvalResultSchema = z.object({
  reason: z.string().describe("the reasoning for the rating"),
  rating: z
    .number()
    .describe(
      "A 0-100 numeric rating of the evaluation, 0 is the worst, 100 is the best"
    ),
  result: z
    .enum(["good", "medium", "bad"])
    .describe("Describing the evaluation outcome as either good,medium or bad"),
  suggestions: z
    .array(z.string())
    .describe("List of suggestions for improvements, if any"),
  prompt: z.string(),
});

export type EvalResult = z.infer<typeof EvalResultSchema>;
export type EvalInstance<TParams = EvalParams> = {
  run(params?: TParams): Promise<EvalResult>;
};

const RESPONSEFORMAT = `Only respond in json, with the following format: 
    {"result": "good|medium|bad|", "reason": string, "rating": number, "suggestions": array<string>  }`;

export abstract class AbstractEval<TParams = EvalParams> {
  model: LanguageModelV1;
  params?: TParams = undefined;

  // instructions are for the individual eval
  abstract instructions: string;

  // system prompt provided by overarching class
  readonly systemPrompt: string;

  constructor(model: LanguageModelV1, systemPrompt: string) {
    /*
    if (typeof model === "string") {
      model = dmr(model as string);
    } else {
      model = model as LanguageModelV1;
    } */

    this.model = model;
    this.systemPrompt = systemPrompt;
  }

  // implementation of generating the LLM response based on the prompt generated
  async generateObject(prompt: string): Promise<EvalResult> {
    // todo - prompt clean up, etc

    let result = (
      await generateObject({
        model: this.model,
        system: this.systemPrompt,
        prompt: prompt,
        schema: EvalResultSchema,
        mode: "json",
      })
    ).object;

    result.prompt = prompt;
    return result;
  }

  async evaluate(params: TParams): Promise<EvalResult> {
    if (params) {
      this.params = { ...this.params, ...params };
    }

    const prompt = `
    ${(await this.createPrompt()).map((x) => x.prompt).join("/n/n")}
    ${RESPONSEFORMAT}`;

    return await this.generateObject(prompt);
  }

  async createPrompt(): Promise<Array<{ key: string; prompt: string }>> {
    if (!this.params) {
      return [];
    }

    const p = this.params as unknown as EvalParams;

    if (!p.format) {
      p.format = "html";
    }

    if (p.url) {
      p.content = await this._fetch(p.url);
    }

    const pa: Array<{ key: string; prompt: string }> = [];
    pa.push({ key: "instructions", prompt: this.instructions });

    if (p.persona) {
      pa.push({
        key: "persona",
        prompt: `Persona: ###
        I'm a ${p.persona.name} - ${p.persona.description}
      ###`,
      });
    }

    if (p.intent) {
      pa.push({
        key: "intent",
        prompt: `Intent: ###   
        ${p.intent}
      ###`,
      });
    }

    if (p.expectation) {
      pa.push({
        key: "expectation",
        prompt: `Expectation: ###   
        ${p.expectation}
      ###`,
      });
    }

    pa.push({
      key: "content",
      prompt: `${p.format}: ###
        ${p.content}
      ###`,
    });

    pa.push({ key: "format", prompt: RESPONSEFORMAT });

    return pa;
  }

  private async _fetch(params: FetchParams): Promise<string> {
    if (!params.selector) {
      params.selector = "body";
    }

    const html = await (await fetch(params.url)).text();
    var element = HTMLParser.parse(html).querySelector(params.selector);
    if (params.filter) {
      params.filter.forEach((selector) => {
        const el = element.querySelector(selector);
        if (el) {
          el.remove();
        }
      });
    }

    let h = element.innerHTML;
    //h = h
    //  .replace(/<([^ >]+)[^>]*>/gi, "<$1>")
    //  .replace(/^\s+|\s+$|\s+(?=\s)/g, "");

    return h;
  }
}
