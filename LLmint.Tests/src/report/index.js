"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var consts_1 = require("../consts");
var tsdoc_report_json_1 = require("../../tsdoc-report.json");
var fs = require("fs");
var path = require("path");
var TITLE = "Test Results";
var READMEFILE = "../../README.md";
var renderSuite = function suite(suite) {
    var result = "\n## ".concat(suite.testResults[0].ancestorTitles[0], "\n").concat(renderTests(suite.testResults));
    return result;
};
var renderTests = function suite(tests) {
    var groupedTests = tests.reduce(function (result, currentValue) {
        (result[currentValue.title] = result[currentValue.title] || []).push(currentValue);
        return result;
    }, {});
    var result = "\n| **Test Case** | ".concat(consts_1.default.models
        .map(function (model) { return " **".concat(model.type, ":").concat(model.model, "** |"); })
        .join(""), "\n| --- | ").concat(consts_1.default.models.map(function (model) { return " --- |"; }).join(""), "\n").concat(Object.keys(groupedTests)
        .map(function (key) {
        var modelTests = groupedTests[key];
        return "| ".concat(key, " | ").concat(consts_1.default.models
            .map(function (model) {
            var modelTest = modelTests.filter(function (test) { return test.ancestorTitles[1] === "".concat(model.type, ":").concat(model.model); })[0];
            return "".concat(modelTest.status === "passed" ? " \uD83D\uDFE2 " : " \uD83D\uDD34 ", " <br><small>").concat(modelTest.duration / 1000, " Sec</small> |");
        })
            .join(""), "\n");
    })
        .join(""), "\n");
    return result;
};
var tests = tsdoc_report_json_1.results.testResults;
var reportMarkdown = "# ".concat(TITLE, "\n").concat(tests.map(function (result) { return renderSuite(result); }).join(""), "\n");
var readme = fs.readFileSync(path.join(__dirname, "readme.md"), "utf8");
readme += "\n" + reportMarkdown;
fs.writeFileSync(path.join(__dirname, READMEFILE), readme, "utf8");
