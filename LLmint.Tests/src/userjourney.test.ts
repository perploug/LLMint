jest.setTimeout(500000);

import LLmint from "llmint";

import { HtmlContentGenerator } from "./generator/htmlContent";
import dmr from "./llm/docker-model-runner";
import consts from "./consts";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

describe.each(consts.models)(`Userjourney`, (model) => {
  describe(`${model.type}:${model.model}`, () => {
    let llmint: LLmint;
    let html: HtmlContentGenerator;

    let modelProvider: LanguageModelV1;

    beforeAll(async () => {
      if (model.type === "local") {
        modelProvider = dmr(model.model);
      }

      if (model.type === "openai") {
        const openai = createOpenAI({
          // custom settings, e.g.
          compatibility: "strict", // strict mode, enable when using the OpenAI API
          apiKey: process.env.OPENAI_KEY,
        });
        modelProvider = openai(model.model);
      }

      if (!modelProvider) throw "No model provider found";

      llmint = new LLmint(modelProvider);
      html = new HtmlContentGenerator(modelProvider);
    });

    it("Verify product page has a clear call to action", async () => {
      const content = await html.generate({
        instructions: `Generate a 50 word flying car product page, with a clear CTA for signing up for flying car product news`,
        format: `Should have the following html structure:
                <main>
                <article>
                    <h1>Headline</h1>
                    <article>
                        Product description
                    </article>

                    <a class='button'>CALLTOACTIONTEXT</a>
                </article>
                </main>
            `,
      });

      const result = await llmint.userJourney.callToAction.evaluate({
        content: content,
        persona: {
          name: `Car buyer`,
          description: `I'm on the market for a flying car once it gets available`,
        },
        intent: `I want to get news about this product in the future`,
        expectation: `I should be prompted to sign up for a newsletter about the flying car product`,
      });

      expect(result.result, result.reason).toBe("good");
    });

    it("Verify form guides user to the next step", async () => {
      const content = await html.generate({
        instructions:
          "Generate a form for joining the flying car product waiting list, to be among the first to buy a car, this should ask for basic information, car prefernces, and then lead the user to the next page where they enter their credit card information ",
        format: `Should have the following html structure:
                <main>
                <form id='form'>
                    <h1>TITLE</h1>

                    <ul>
                      <-- each form field should follow this structure -->
                      <li>
                        <label>LABEL</label>
                        INPUT FIELD
                      </li>
                    </ul>

                    <!-- button leads to the next step where the user should input their credit card -->
                    <input type='submit' text='BUTTON_LABEL'/>
                </form>
                </main>
            `,
      });

      const result = await llmint.userJourney.nextSteps.evaluate({
        content: content,
        persona: {
          name: `Car buyer`,
          description: `I'm on the market for a flying car once it gets available`,
        },
        intent: "I'm signing up for the flying car waiting list",
        expectation: `This is a big decision, so I want to feel well guided through the process`,
      });

      expect(result.result, result.reason).toBe("good");

      const bad_result = await llmint.userJourney.nextSteps.evaluate({
        content: content,
        persona: {
          name: "Car enthusiast",
          description: `You are interested in flying cars, but in no way ready to buy one`,
        },
        intent:
          "I'm only entering my information to get news updates about the car",
        expectation: `I expect to only enter basic information, with no commitment.`,
      });

      expect(bad_result.result, bad_result.reason).toBe("bad");
    });
  });
});
