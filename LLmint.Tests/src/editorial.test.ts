jest.setTimeout(500000);

import LLmint from "llmint";

import { HtmlContentGenerator } from "./generator/htmlContent";
import dmr from "./llm/docker-model-runner";
import consts from "./consts";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * @description
 * Editorial tests for determining if html content follows best practices
 */
describe.each(consts.models)(`Editorial`, (model) => {
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

    const styleGuide = `

      # Styleguide

      ## Voice
        At Mailchimp, we’ve walked in our customers' shoes, and we know marketing technology is a minefield of confusing terminology. That’s why we speak like the experienced and compassionate business partner we wish we’d had way back when.
        We treat every hopeful brand seriously. We want to educate people without patronizing or confusing them.

        Using offbeat humor and a conversational voice, we play with language to bring joy to their work. We prefer the subtle over the noisy, the wry over the farcical. We don't take ourselves too seriously.

        Whether people know what they need from us or don’t know the first thing about marketing, every word we say informs and encourages. We impart our expertise with clarity, empathy, and wit.

        All of this means that when we write copy:

        We are plainspoken. We understand the world our customers are living in: one muddled by hyperbolic language, upsells, and over-promises. We strip all that away and value clarity above all. Because businesses come to Mailchimp to get to work, we avoid distractions like fluffy metaphors and cheap plays to emotion.

        We are genuine. We get small businesses because we were one not too long ago. That means we relate to customers’ challenges and passions and speak to them in a familiar, warm, and accessible way.

        We are translators. Only experts can make what’s difficult look easy, and it’s our job to demystify B2B-speak and actually educate.

        Our humor is dry. Our sense of humor is straight-faced, subtle, and a touch eccentric. We’re weird but not inappropriate, smart but not snobbish. We prefer winking to shouting. We’re never condescending or exclusive—we always bring our customers in on the joke.

      ##  Tone
        Mailchimp’s tone is usually informal, but it’s always more important to be clear than entertaining. When you’re writing, consider the reader’s state of mind. Are they relieved to be finished with a campaign? Are they confused and seeking our help on Twitter? Once you have an idea of their emotional state, you can adjust your tone accordingly.

        Mailchimp has a sense of humor, so feel free to be funny when it’s appropriate and when it comes naturally to you. But don’t go out of your way to make a joke—forced humor can be worse than none at all. If you’re unsure, keep a straight face.

      ##  Style tips
        Here are a few key elements of writing Mailchimp’s voice. For more, see the Grammar and mechanics section.

        - Active voice Use active voice. Avoid passive voice.
        - Avoid slang and jargon Write in plain English.
        - Write positively Use positive language rather than negative language.
    `;

    it("Verify tone of voice follows styleguide", async () => {
      const content = await html.generate({
        instructions:
          "Generate a 200 word news article about the new ape mail product by mailchimp",
        styleGuide: styleGuide,
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

      const result = await llmint.editorial.toneOfVoice.evaluate({
        styleguide: styleGuide,
        content: content,
      });

      expect(result.result, result.reason).not.toBe("bad");
    });

    it("Verify tone of voice is completely off", async () => {
      const content = await html.generate({
        instructions:
          "Generate a 200 word news article about the new ape mail product by mailchimp",
        styleGuide: `
            We are serious people, and write for even more serious people

            - Language should be academic, technical and extremely formal
            - You are inspired by the prose of James Joyce
            - You write as terse as a Morgan Stanley financial contract on collateral debt obligations
            - You are also extremely drunk and confused
            `,

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

      const result = await llmint.editorial.toneOfVoice.evaluate({
        styleguide: styleGuide,
        content: content,
      });

      expect(result.result, result.reason).toBe("bad");
    });
  });
});
