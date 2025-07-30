import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('@tsdoc-test-reporter/jest').TsDocTestReporterConfig} */
const options = {
  outputFileName: "tsdoc-report",
  outputFileType: `json`,
  outputJsonAs: "raw",
};

/** @type {import("jest").Config} **/
export const reporters = ["default", ["@tsdoc-test-reporter/jest", options]];
export const preset = "ts-jest";
export const testEnvironment = "node";
export const setupFilesAfterEnv = ["jest-expect-message"];
export const transform = {
  ...tsJestTransformCfg,
};
