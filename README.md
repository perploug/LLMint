# LLMint - Web Quality Eval library

Note: This is WIP with limited functionality implemented

LLMint is an open-source TypeScript toolkit that brings quality assurance to modern websites using large language models. Validate content structure, tone of voice, SEO integrity, internal linking, and accessibility — all powered by prompt-based inspections and test container automation. LLMint helps you ensure your web experience is clear, consistent, inclusive, and aligned with user intent.

Based on the POC outlined in this [blogpost](http://plo.ug/llms,/typescript,/testing/2025/06/26/LLMs-for-testing.html)

Library is focused on making common tasks discoverable, rather than depending on broad general functions, tests should
be readable by reading the prompt and function calls to understand what is going on, less making, more explicit.

Library is focused on using local LLMs such as Docker Model Runner and Ollama.

Can be used against live websites, but primary focus is ontop of Testcontainers based tests.

## Overview

1. Plugin any LLM, comes with Docker Model Runner and TestContainers support
2. Use either fetch for serverside html, or headless browser to evaluate DOM
3. Comes with overridable system prompts and task prompts
4. Adjustable adherence to standards, strict or loose
5. Test framework agnostic

## How to use

Library is agnostic to test framework, it simply needs a URL or raw html string to perform the evals, using either local or hosted LLM

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
    rating: 1-10
    reason: string (reason for the result)
    suggestions: Array<string> (suggestions for improvement)
    prompt: string (the full prompt sent to the model)
  }
```

## Planned features

| **Test Scenario**                        | **Objective**                                                                                       | **LLM Prompt Example**                                                                                                                                                                   | **Implemented** |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Validate Intent and Expectation          | Ensure HTML returned matches the intent and expectation of a given persona                          | n/a                                                                                                                                                                                      | ✅              |
| Content Structure Validation             | Ensure HTML uses semantic structure (headings, sections, landmarks) for usability and accessibility | "Review the following HTML and evaluate whether it uses semantic tags (like `<article>`, `<section>`, `<nav>`), follows proper heading hierarchy (H1–H6), and avoids structural issues." |                 |
| Tone of Voice Consistency                | Check that copy is aligned with the brand's tone guide (e.g., friendly, authoritative, clear)       | "Evaluate the tone of this content. Does it sound friendly, clear, and aligned with [brand] tone guidelines? Highlight any inconsistent or off-brand language."                          | ✅              |
| Content Readability                      | Assess reading level and clarity for target audience                                                | "Is this content readable and appropriate for a general audience (e.g., US grade 8 reading level)? Suggest any sentences that could be made clearer or simpler."                         | ✅              |
| Content Relevance to Page Title          | Ensure that the page content aligns with its title and meta description                             | "Analyze whether the body content accurately reflects the page title and meta description. Are they consistent and representative?"                                                      |                 |
| Search Relevance Evaluation              | Validate that search results are accurate and ranked by intent                                      | "Given the user query and the list of search results (title + snippet), assess the relevance and rank appropriateness of each result."                                                   |                 |
| Internal Linking Quality                 | Evaluate whether internal links support navigation and topic depth                                  | "Review the internal links in this page. Are they contextually relevant, helpful for navigation, and appropriately anchored?"                                                            |                 |
| Content Recommendations Quality          | Ensure recommended content is topically and contextually relevant                                   | "Given the main content and the recommended articles, assess how well the recommendations align with the user’s interest and intent."                                                    |                 |
| Accessibility Heuristics                 | Check for common accessibility issues in copy and layout                                            | "Scan this HTML and content for accessibility issues: missing alt text, color contrast warnings, ambiguous link text, or poor keyboard navigation."                                      |                 |
| Duplicate or Redundant Content           | Detect repeated or overly similar blocks within or across pages                                     | "Analyze this content for any duplication or unnecessary repetition. Is there a more concise way to present it?"                                                                         | ✅              |
| Clarity of Calls-to-Action (CTAs)        | Ensure CTAs are clear, action-oriented, and not confusing                                           | "Are the calls to action in this page clear and compelling? Suggest improvements to clarity, action verbs, or placement."                                                                | ✅              |
| Bias & Inclusivity Check                 | Identify biased, non-inclusive, or insensitive language                                             | "Scan this text for language that could be considered biased, non-inclusive, or insensitive. Suggest revisions."                                                                         | ✅              |
| Metadata & SEO Tags Validation           | Assess meta tags, titles, descriptions, and canonical tags for SEO compliance                       | "Evaluate these SEO meta tags. Are the title, description, and canonical URL optimized and reflective of the page content?"                                                              |                 |
| Image Description Evaluation             | Validate alt text for descriptiveness and relevance                                                 | "Review the image alt texts provided. Are they meaningful, concise, and descriptive of the visual content?"                                                                              |                 |
| Content Emotion/Affect                   | Analyze emotional tone and alignment with intent (e.g., reassuring, exciting)                       | "Analyze the emotional tone of this content. Does it convey the intended emotion (e.g., reassuring, motivating)? Suggest refinements."                                                   |                 |
| Page Consistency Across Variants         | Check that A/B versions or localized content remain consistent in message and quality               | "Compare these two content versions. Are the messages and tone consistent? Highlight discrepancies or quality differences."                                                              |                 |
| User Journey Continuity                  | Ensure the content leads users logically through next steps                                         | "Does the content guide the user clearly to a logical next action or step in their journey? Identify any gaps or unclear transitions."                                                   | ✅              |
| FAQ/Helpfulness of Informational Content | Validate whether FAQ or help content actually answers the user’s question                           | "Given the question and the provided answer, assess whether the content resolves the user's concern clearly and completely."                                                             |                 |
| Spam/Over-Optimization Detection         | Detect keyword stuffing or unnatural language meant for SEO                                         | "Check this content for signs of keyword stuffing or unnatural repetition. Is it overly optimized at the cost of readability?"                                                           |                 |
| Temporal Relevance / Freshness           | Validate whether content is up-to-date and not misleading due to age                                | "Does this content include outdated references or time-sensitive claims that should be refreshed?"                                                                                       |                 |
| Cross-Device Context Appropriateness     | Evaluate whether the content remains appropriate across different screen sizes or devices           | "Would this content remain usable and understandable on small screens or voice interfaces? Suggest adjustments for better multi-device usability."                                       |                 |

## Future ideas to explore

- Use tooling for testing
- Create a testing agent, which can make decisions on what tests to run
- MCP server in front of the library
- Go beyond text content
