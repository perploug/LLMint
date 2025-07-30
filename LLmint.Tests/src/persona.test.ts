jest.setTimeout(500000);

import LLmint from "llmint";

import { HtmlContentGenerator } from "./generator/htmlContent";
import dmr from "./llm/docker-model-runner";
import consts from "./consts";
import { createOpenAI } from "@ai-sdk/openai";

describe.each(consts.models)(`Persona`, (model) => {
  describe(`${model.type}:${model.model}`, () => {
    let llmint: LLmint;
    let html: HtmlContentGenerator;

    let modelProvider;

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

      llmint = new LLmint(modelProvider);
      html = new HtmlContentGenerator(modelProvider);
    });

    it("Content should be indetified as a simple Hello World page", async () => {
      const content = `
        <h1>Hello world!</h1>
        <p>Hello world! - this is just a simple article</p>
    `;

      const result = await llmint.persona.validateIntent.evaluate({
        content: content,
        expectation:
          "The content should be a simple hello world sample with just a headline and single paragraph",
      });

      expect(result.result, result.reason).toBe("good");
    });

    it("Article content should match persona, intent and expectations", async () => {
      const content = await html.generate({
        instructions:
          "Generate a 200 word news article  about flying cars with headline, publishing date, introduction and body text",
        format: `Should have the following html structure:
                <main>
                <article>
                    <h1>Headline</h1>
                    <time datetime="">Publishing time</time>
                    <article>
                        Article body
                    </article>
                </article>
                </main>
            `,
      });

      const result = await llmint.persona.validateIntent.evaluate({
        content: content,
        expectation: `The content should be about a flying car and be semantically well structured
        with a headline, publishing date, introduction and be about 200 words long`,
      });

      expect(result.result, result.reason).toBe("good");
    });

    it("search results should match query, persona and intent", async () => {
      const content = await html.generate({
        instructions:
          "Generate a list of 10 search results for the query 'flying cars' results should be targetted a technical persona, with click baity and inticing headlines, ensure summaries include technical details on model and features",
        format: `Should have the following html structure:
                <main>
                <div id='search'>
                    <h1>Search Results:</h1>

                    <ul>
                      <-- each result should use this below format -->
                      <li>
                      <h2><a href="LINK">HEADLINE</h2>
                        <time datetime="">Publishing time</time>
                        <article>
                          Search result summary
                        </article>
                      </li>
                    </ul>
                </article>
                </main>
            `,
      });

      const result = await llmint.persona.validateIntent.evaluate({
        content: content,
        persona: {
          name: "Community member",
          description: `You are a member of the internet flying car community, you are really into click baity articles about flying cars and are most interested in the technical details`,
        },
        intent:
          "I'm searching the site for 'flying cars' as I'm looking for interesting technical articles on this topic",
        expectation: `Atleast 5 search results about flying cars, with summaries that make it easy to pick the right result`,
      });

      expect(result.result, result.reason).toBe("good");

      const bad_result = await llmint.persona.validateIntent.evaluate({
        content: content,
        persona: {
          name: "Elementary school teacher",
          description: `You are an elementary school teacher, you are not technical, but prefer academic litterature on your different topics of interest.`,
        },
        intent:
          "I'm searching the site for 'flying cats and looking for content useful for grade school students to get excited about how great flying cats are",
        expectation: `I expect 10 search results, mostly about flying cats, for children or tweens to get excited about the topic`,
      });

      expect(bad_result.result, bad_result.reason).toBe("bad");
    });

    it("search results should mismatch persona, but match expecation", async () => {
      const content = await html.generate({
        instructions:
          "Generate a list of 10 search results for the query 'flying cars' results should be targetted a technical persona, with click baity and inticing headlines, ensure summaries include technical details on model and features",
        format: `Should have the following html structure:
                <main>
                <div id='search'>
                    <h1>Search Results:</h1>

                    <ul>
                      <-- each result should use this below format -->
                      <li>
                      <h2><a href="LINK">HEADLINE</h2>
                        <time datetime="">Publishing time</time>
                        <article>
                          Search result summary
                        </article>
                      </li>
                    </ul>
                </article>
                </main>
            `,
      });

      const bad_result = await llmint.persona.validateIntent.evaluate({
        content: content,
        persona: {
          name: "Elementary school teacher",
          description: `You are an elementary school teacher, you are not technical, but prefer academic litterature on your different topics of interest.`,
        },
        intent:
          "I'm searching the site for 'flying cats and looking for content useful for grade school students to get excited about how great flying cats are",
        expectation: `I expect 10 search results, mostly about flying cats, for children or tweens to get excited about the topic`,
      });

      expect(bad_result.result, bad_result.reason).toBe("bad");
    });
  });
});
