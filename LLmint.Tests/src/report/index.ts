import consts from "../consts";
import { results } from "../../tsdoc-report.json";
import * as fs from "fs";
import * as path from "path";

interface TestSuite {
  leaks: boolean;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  numTodoTests: number;
  openHandles: any[];
  perfStats: PerfStats;
  skipped: boolean;
  snapshot: Snapshot;
  testFilePath: string;
  testResults: TestResult[];
  failureMessage: string | null;
}

interface TestResult {
  ancestorTitles: string[];
  duration: number;
  failureDetails: any[];
  failureMessages: any[];
  fullName: string;
  invocations: number;
  location: null;
  numPassingAsserts: number;
  retryReasons: any[];
  status: string;
  title: string;
}

interface Snapshot {
  added: number;
  fileDeleted: boolean;
  matched: number;
  unchecked: number;
  uncheckedKeys: any[];
  unmatched: number;
  updated: number;
}

interface PerfStats {
  end: number;
  runtime: number;
  slow: boolean;
  start: number;
}

const TITLE = "Test Results";
const READMEFILE = "../../README.md";

const renderSuite = function suite(suite: TestSuite): string {
  let result = `
## ${suite.testResults[0].ancestorTitles[0]}
${renderTests(suite.testResults)}`;

  return result;
};

const renderTests = function suite(tests: TestResult[]) {
  let groupedTests = tests.reduce(
    (result: Record<string, Array<TestResult>>, currentValue: TestResult) => {
      (result[currentValue.title] = result[currentValue.title] || []).push(
        currentValue
      );
      return result;
    },
    {}
  );

  let result = `
| **Test Case** | ${consts.models
    .map((model) => ` **${model.type}:${model.model}** |`)
    .join("")}
| --- | ${consts.models.map((model) => ` --- |`).join("")}
${Object.keys(groupedTests)
  .map((key) => {
    const modelTests = groupedTests[key];

    return `| ${key} | ${consts.models
      .map((model) => {
        const modelTest = modelTests.filter(
          (test) => test.ancestorTitles[1] === `${model.type}:${model.model}`
        )[0];
        return `${modelTest.status === "passed" ? ` 🟢 ` : ` 🔴 `} <br><small>${
          modelTest.duration / 1000
        } Sec</small> |`;
      })
      .join("")}\n`;
  })
  .join("")}\n`;

  return result;
};

const tests = results.testResults as TestSuite[];
const reportMarkdown = `# ${TITLE}
${tests.map((result) => renderSuite(result as TestSuite)).join("")}
`;

let readme = fs.readFileSync(path.join(__dirname, "readme.md"), "utf8");
readme += "\n" + reportMarkdown;

fs.writeFileSync(path.join(__dirname, READMEFILE), readme, "utf8");
