const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
  outputFileName: "tsdoc-report",
  outputFileType: `html`,
};

/** @type {import("jest").Config} **/
module.exports = {
  reporters: ["default", ["@tsdoc-test-reporter/jest", options]],
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-expect-message"],
  transform: {
    ...tsJestTransformCfg,
  },
};
