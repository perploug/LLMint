import { generateText, LanguageModelV1 } from "ai";
import dmr from "../llm/docker-model-runner";

// this class is merely used for internal tests
export class HtmlContentGenerator {
  model: LanguageModelV1;
  systemPrompt = `You are a html generator, an expert in creating editorial content following 
                    the provided sample html structure, by default you will always create
                    semantically correct HTML, unless instructed otherwise
                    
                    Your writing is short, to the point and strictly following the theme and topic 
                    provided in the instructions.
                    
                    You strive for realistic html with headlines, bold text, links, lists and quotes
                    `;

  constructor(model: string | LanguageModelV1) {
    if (typeof model === "string") {
      this.model = dmr(model as string);
    } else {
      this.model = model as LanguageModelV1;
    }
  }

  async generate(params: {
    instructions: string;
    styleGuide?: string;
    format?: string;
  }): Promise<string> {
    return (
      await generateText({
        model: this.model,
        system: this.systemPrompt,
        prompt: `
            ${params.instructions}

            ${
              params.styleGuide
                ? `
            
            Follow this styleguide for language, tone of voice, etc

            styleguide: ###
                ${params.styleGuide}
            ###
            `
                : ""
            }
            
            ${
              params.format
                ? `
            
            Format the content with the below html as a template and place the content 
            according to the description in the elements

            html: ###
                ${params.format}
            ###
            `
                : ""
            }

        `,
      })
    ).text;
  }
}
