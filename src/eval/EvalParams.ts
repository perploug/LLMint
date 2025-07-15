export type FetchParams = {
  url: string;
  selector?: string;
  filter?: Array<string>;
};

export type EvalParams = {
  persona?: Persona;
  intent?: string;
  expectation?: string;
  content?: string;
  url?: FetchParams;
  format?: "html" | "json" | "text";
};

export type Persona = {
  name: string;
  description: string;
};
