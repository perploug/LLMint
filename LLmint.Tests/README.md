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

# Test Results

## Userjourney

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- |
| Verify product page has a clear call to action |  🟢  <br><small>28.018 Sec</small> | 🔴  <br><small>8.479 Sec</small> | 🔴  <br><small>15.122 Sec</small> | 🟢  <br><small>6.079 Sec</small> |
| Verify form guides user to the next step |  🔴  <br><small>36.366 Sec</small> | 🔴  <br><small>13.195 Sec</small> | 🔴  <br><small>26.943 Sec</small> | 🔴  <br><small>11.245 Sec</small> |


## Persona

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- |
| Hello world |  🟢  <br><small>6.77 Sec</small> | 🟢  <br><small>3.156 Sec</small> | 🟢  <br><small>2.706 Sec</small> | 🟢  <br><small>1.921 Sec</small> |
| Identify the content of an article |  🟢  <br><small>36.108 Sec</small> | 🟢  <br><small>8.873 Sec</small> | 🟢  <br><small>22.989 Sec</small> | 🟢  <br><small>9.365 Sec</small> |
| validate search results |  🟢  <br><small>115.983 Sec</small> | 🟢  <br><small>63.045 Sec</small> | 🔴  <br><small>48.547 Sec</small> | 🟢  <br><small>39.924 Sec</small> |


## Editorial

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- |
| Verify tone of voice follows styleguide |  🟢  <br><small>48.408 Sec</small> | 🟢  <br><small>17.294 Sec</small> | 🟢  <br><small>24.268 Sec</small> | 🟢  <br><small>11.689 Sec</small> |
| Verify tone of voice is completely off |  🟢  <br><small>42.054 Sec</small> | 🟢  <br><small>13.504 Sec</small> | 🔴  <br><small>23.736 Sec</small> | 🟢  <br><small>11.569 Sec</small> |


