import PageCopy from "./evals/page-copy-evals";
import dmr from "./llm/docker-model-runner";
import fetchScraper from "./scraper/fetch-scraper";

async function run() {
  const d = dmr();
  const pc = new PageCopy(d, fetchScraper);
  const result = await pc.toneOfVoice
    .instruct({
      styleguide: "be nice",
      instructions: "I expect all content to be in polish",
      url: "https://dr.dk",
    })
    .run();

  console.log(result);
}

run();
