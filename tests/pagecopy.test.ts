import dmr from "../src/llm/docker-model-runner";
import fetchScraper from "../src/scraper/fetch-scraper";
import PageCopy from "../src/evals/page-copy-evals";

jest.setTimeout(100000);

describe("Basic content tests", () => {
  let pc: PageCopy;

  beforeAll(async () => {
    const d = dmr();
    pc = new PageCopy(d, fetchScraper);
  });
  afterAll(async () => {});

  it("Dr.dk should be in polish", async () => {

    console.log(pc.)
    const result = await pc.toneOfVoice
      .instruct({
        styleguide: "be nice",
        instructions: "I expect all content to be in polish",
        url: "https://dr.dk",
      })
      .run();

    expect(result.rating).toBeGreaterThan(50);
  });
});
