# LLMint.Tests

LLMint test suite to run LLMint against different large language models to determine cosistent
responses and detect slow executing prompts.

The test suite is currently WIP and only covers a subset of the library, but will continue to expand
as the library is built out.

Currently LLMInt is tested against:

- Smollm3
- Gemma3
- Qwen3
- OpenAI gpt-4-turbo as a baseline comparison.

All local models run via Docker Model Runner
