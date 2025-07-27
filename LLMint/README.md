# LLMint - Web Quality Eval library

Note: This is WIP with limited functionality implemented

LLMint is an open-source TypeScript toolkit that brings quality assurance to modern websites using large language models. Validate content structure, tone of voice, SEO integrity, internal linking, and accessibility — all powered by prompt-based inspections and test container automation. LLMint helps you ensure your web experience is clear, consistent, inclusive, and aligned with user intent.

Based on the POC outlined in this [blogpost](http://plo.ug/llms,/typescript,/testing/2025/06/26/LLMs-for-testing.html)

- Tests are instantly readable as it uses prompts rather than html parsing
- Library comes with standard uses cases to aid discovery over generic prompting
- Focus is on providing developers and non-developers simple ways to perform subjective judgement on editorial content, structure, user journeys and persona intent and expectations

## How to use

Library is test framework agnostic, it simply needs raw html string to perform the evals, using either local or hosted LLM

## Examples

### Setting up with with Docker Model Runner or Vercel AI SDK provider

```javascript

// DMR:
cons llmint = new LLMint("ai/qwen3");

// openai:
import { createOpenAI } from "@ai-sdk/openai";
const openai = createOpenAI({
    apiKey: "...",
  });
const model = openai("gpt-4-turbo");
cons llmint = new LLMint(model);

llmint.editorial
        .toneOfVoice
        .evaluate({...})
```

### Tone of voice:

```javascript
    const ev = await llmint.editorial.toneOfVoice.evaluate({
      styleguide: "Write short and concisely",
      content: "<body>...</body>,
      expectation: `I expect this article to follow the styleguide provided and
                    be about how this body tag is completely empty`,
    });
```

### Validate content for a given persona, intent and expectation

```javascript
import LLMint from "llmint";
const llmint = new LLMint("ai/qwen3");

it("Blog posts should be listed with punchy headlines and sorted by date", async () => {
  const content = await fetchHelper({
    url: `site.com/blog`,
    selector: "article",
  });

  const ev = await llmint.persona.validateIntent.evaluate({
    persona: {
      name: "Community member",
      description: `You are an umbraco community member, with a developer
                      background, highly interested in community events
                      and eager to find out more about umbraco`,
    },

    intent: `I am browsing this page to find news about umbraco and its community
        I am only interested in click-baity and exciting news, if I see anything
        boring I will rage and quit the site`,

    expectation: `I expect blog posts to have interesting
        headlines and be sorted by date with the latest posts first`,

    content: content,
  });

  console.log(ev);
  expect(ev.result, ev.reason).toBe("good");
});
```

## Test result data returned

Each evaluation returns a json object with the following structure:

```javascript
  {
    result: good|medium|bad
    rating: 1-100
    reason: string (reason for the result)
    suggestions: Array<string> (suggestions for improvement)
    prompt: string (the full prompt sent to the model)
  }
```
