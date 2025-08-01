import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { LanguageModelV1 } from "ai";

import {
  InspectResult,
  log,
  SocatContainer,
  StartedSocatContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

export class DockerModelRunnerContainer extends SocatContainer {
  private model: string | undefined = undefined;
  private static MODEL_RUNNER_ENDPOINT: string = "model-runner.docker.internal";
  private static PORT: number = 80;

  constructor(image: string = "alpine/socat:latest") {
    super(image);
    this.withTarget(
      DockerModelRunnerContainer.PORT,
      DockerModelRunnerContainer.MODEL_RUNNER_ENDPOINT
    ).withWaitStrategy(
      Wait.forHttp("/", DockerModelRunnerContainer.PORT).forResponsePredicate(
        (res) => res.includes("The service is running")
      )
    );
  }

  withModel(model: string): DockerModelRunnerContainer {
    this.model = model;
    return this;
  }

  protected async containerStarted(
    container: StartedTestContainer,
    inspectResult: InspectResult,
    reused: boolean
  ): Promise<void> {
    if (this.model) {
      log.info(`Pulling model: ${this.model}. Please be patient.`);

      const url = `http://${container.getHost()}:${container.getMappedPort(
        DockerModelRunnerContainer.PORT
      )}/models/create`;

      const payload = { from: this.model };

      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        console.log("ok: " + response.ok);

        const reader = response.body?.getReader();
        let charsReceived = 0;

        if (!reader) throw "reader is undefined";

        // read() returns a promise that resolves
        // when a value has been received
        reader.read().then(function processText({ done, value }): any {
          // Result objects contain two properties:
          // done  - true if the stream has already given you all its data.
          // value - some data. Always undefined when done is true.
          if (done) {
            console.log("Model download complete");
            return;
          }
          // value for fetch streams is a Uint8Array
          charsReceived += value.length;
          console.log(value);
          console.log("Chars received: " + charsReceived);

          // Read some more, and call this function again
          return reader.read().then(processText);
        });
      } catch (ex: unknown) {
        const err = ex as Error;
        log.error(`Failed to pull model: ${this.model}: ${err.message} `);
        throw `Failed to pull model: ${this.model}: ${err.message} `;
      }

      log.info(`Finished pulling model: ${this.model}`);
    }
  }

  async start(): Promise<StartedDockerModelRunnerContainer> {
    if (!this.model) throw "No model provided";

    return new StartedDockerModelRunnerContainer(
      await super.start(),
      this.model,
      DockerModelRunnerContainer.PORT
    );
  }
}

export class StartedDockerModelRunnerContainer extends StartedSocatContainer {
  private port: number;
  private model: string;

  constructor(
    startedTestContainers: StartedTestContainer,
    model: string,
    port: number
  ) {
    super(startedTestContainers);
    this.model = model;
    this.port = port;
  }

  getBaseEndpoint(): string {
    return "http://" + this.getHost() + ":" + this.getMappedPort(this.port);
  }

  getOpenAIEndpoint(): string {
    return this.getBaseEndpoint() + "/engines";
  }

  getLanguageModel(): LanguageModelV1 {
    const model = new OpenAICompatibleChatLanguageModel(
      this.model,
      {},
      {
        supportsStructuredOutputs: true,
        defaultObjectGenerationMode: "json",
        headers: () => ({}),
        provider: `docker-model-runner`,
        url: ({ path }) => {
          const url = new URL(`${this.getBaseEndpoint()}/engines/v1${path}`);
          return url.toString();
        },
      }
    );

    return model;
  }
}
