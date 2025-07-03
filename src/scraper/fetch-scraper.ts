var HTMLParser = require("node-html-parser");

export type fetchParams = {
  url: string;
  selector?: string;
  filter?: Array<string>;
};

export async function fetchScraper(params: fetchParams): Promise<string> {
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

  // lets remove all the css stuff we dont need for these evals
  let h = element.innerHTML;
  //h = h
  //  .replace(/<([^ >]+)[^>]*>/gi, "<$1>")
  //  .replace(/^\s+|\s+$|\s+(?=\s)/g, "");

  return h;
}

export default fetchScraper;
