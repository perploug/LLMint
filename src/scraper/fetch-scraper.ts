var HTMLParser = require("node-html-parser");

type fetchParams = {
  url: string;
  selector?: string;
  filter?: Array<string>;
};

const fetchScraper = async function (params: fetchParams): Promise<string> {
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

  return element.innerHTML;
};

export default fetchScraper;
