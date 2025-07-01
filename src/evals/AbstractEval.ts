import { generateObject, GenerateObjectResult, LanguageModelV1 } from "ai";
import { z } from "zod";

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
});

export type EvalResult = z.infer<typeof EvalResultSchema>;

export type EvalInstance<TParams> = {
  run(params?: TParams): Promise<EvalResult>;
};

export abstract class AbstractEval<TParams> {
  model: LanguageModelV1;
  scraper: (params: any) => Promise<string>;
  params?: TParams = undefined;
  systemPrompt: string;

  constructor(model: LanguageModelV1, scraper: any, systemPrompt: string) {
    this.model = model;
    this.scraper = scraper;
    this.systemPrompt = systemPrompt;
  }

  async generateObject(prompt: string): Promise<EvalResult> {
    return (
      await generateObject({
        model: this.model,
        system: this.systemPrompt,
        prompt: prompt,
        schema: EvalResultSchema,
      })
    ).object;
  }

  instruct(params: TParams): EvalInstance<TParams> {
    this.params = params;
    return this;
  }

  abstract run(params?: TParams): Promise<EvalResult>;
}
