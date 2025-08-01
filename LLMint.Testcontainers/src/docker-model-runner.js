"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedDockerModelRunnerContainer = exports.DockerModelRunnerContainer = void 0;
var openai_compatible_1 = require("@ai-sdk/openai-compatible");
var testcontainers_1 = require("testcontainers");
/* @ts-ignore */
var stream_promise_1 = require("stream-promise");
var DockerModelRunnerContainer = /** @class */ (function (_super) {
    __extends(DockerModelRunnerContainer, _super);
    function DockerModelRunnerContainer(image) {
        if (image === void 0) { image = "alpine/socat:latest"; }
        var _this = _super.call(this, image) || this;
        _this.model = undefined;
        _this.withTarget(DockerModelRunnerContainer.PORT, DockerModelRunnerContainer.MODEL_RUNNER_ENDPOINT).withWaitStrategy(testcontainers_1.Wait.forHttp("/", DockerModelRunnerContainer.PORT).forResponsePredicate(function (res) { return res.includes("The service is running"); }));
        return _this;
    }
    DockerModelRunnerContainer.prototype.withModel = function (model) {
        this.model = model;
        return this;
    };
    DockerModelRunnerContainer.prototype.containerStarted = function (container, inspectResult, reused) {
        return __awaiter(this, void 0, void 0, function () {
            var url, payload, response, reader, _a, ex_1, err;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.model) return [3 /*break*/, 7];
                        testcontainers_1.log.info("Pulling model: ".concat(this.model, ". Please be patient."));
                        url = "http://".concat(container.getHost(), ":").concat(container.getMappedPort(DockerModelRunnerContainer.PORT), "/models/create");
                        payload = { from: this.model };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch(url, {
                                method: "POST",
                                body: JSON.stringify(payload),
                                headers: { "Content-Type": "application/json" },
                            })];
                    case 2:
                        response = _c.sent();
                        reader = (_b = response.body) === null || _b === void 0 ? void 0 : _b.getReader();
                        _a = stream_promise_1.default;
                        return [4 /*yield*/, (reader === null || reader === void 0 ? void 0 : reader.read())];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent(), { noCollect: true }])];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        ex_1 = _c.sent();
                        err = ex_1;
                        testcontainers_1.log.error("Failed to pull model: ".concat(this.model, ": ").concat(err.message, " "));
                        throw "Failed to pull model: ".concat(this.model, ": ").concat(err.message, " ");
                    case 6:
                        testcontainers_1.log.info("Finished pulling model: ".concat(this.model));
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DockerModelRunnerContainer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.model)
                            throw "No model provided";
                        _a = StartedDockerModelRunnerContainer.bind;
                        return [4 /*yield*/, _super.prototype.start.call(this)];
                    case 1: return [2 /*return*/, new (_a.apply(StartedDockerModelRunnerContainer, [void 0, _b.sent(), this.model,
                            DockerModelRunnerContainer.PORT]))()];
                }
            });
        });
    };
    DockerModelRunnerContainer.MODEL_RUNNER_ENDPOINT = "model-runner.docker.internal";
    DockerModelRunnerContainer.PORT = 80;
    return DockerModelRunnerContainer;
}(testcontainers_1.SocatContainer));
exports.DockerModelRunnerContainer = DockerModelRunnerContainer;
var StartedDockerModelRunnerContainer = /** @class */ (function (_super) {
    __extends(StartedDockerModelRunnerContainer, _super);
    function StartedDockerModelRunnerContainer(startedTestContainers, model, port) {
        var _this = _super.call(this, startedTestContainers) || this;
        _this.model = model;
        _this.port = port;
        return _this;
    }
    StartedDockerModelRunnerContainer.prototype.getBaseEndpoint = function () {
        return "http://" + this.getHost() + ":" + this.getMappedPort(this.port);
    };
    StartedDockerModelRunnerContainer.prototype.getOpenAIEndpoint = function () {
        return this.getBaseEndpoint() + "/engines";
    };
    StartedDockerModelRunnerContainer.prototype.getLanguageModel = function () {
        var _this = this;
        var model = new openai_compatible_1.OpenAICompatibleChatLanguageModel(this.model, {}, {
            supportsStructuredOutputs: true,
            defaultObjectGenerationMode: "json",
            headers: function () { return ({}); },
            provider: "docker-model-runner",
            url: function (_a) {
                var path = _a.path;
                var url = new URL("".concat(_this.getBaseEndpoint(), "/engines/v1").concat(path));
                return url.toString();
            },
        });
        return model;
    };
    return StartedDockerModelRunnerContainer;
}(testcontainers_1.StartedSocatContainer));
exports.StartedDockerModelRunnerContainer = StartedDockerModelRunnerContainer;
