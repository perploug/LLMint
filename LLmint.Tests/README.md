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

## Persona

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **local:ai/smollm2** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- | --- |
| Hello world |  🟢  <br><small>6.034 Sec</small> | 🟢  <br><small>3.108 Sec</small> | 🟢  <br><small>3.204 Sec</small> | 🟢  <br><small>0.824 Sec</small> | 🟢  <br><small>2.948 Sec</small> |
| Identify the content of an article |  🟢  <br><small>33.894 Sec</small> | 🟢  <br><small>9.106 Sec</small> | 🟢  <br><small>23.182 Sec</small> | 🔴  <br><small>117.529 Sec</small> | 🟢  <br><small>13.678 Sec</small> |
| validate search results |  🟢  <br><small>117.746 Sec</small> | 🟢  <br><small>64.541 Sec</small> | 🔴  <br><small>49.165 Sec</small> | 🔴  <br><small>137.226 Sec</small> | 🟢  <br><small>37.989 Sec</small> |


## Editorial

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **local:ai/smollm2** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- | --- |
| Verify tone of voice follows styleguide |  🟢  <br><small>43.935 Sec</small> | 🟢  <br><small>17.712 Sec</small> | 🟢  <br><small>24.677 Sec</small> | 🟢  <br><small>1.735 Sec</small> | 🟢  <br><small>10.899 Sec</small> |
| Verify tone of voice is completely off |  🟢  <br><small>39.632 Sec</small> | 🟢  <br><small>13.854 Sec</small> | 🔴  <br><small>24.764 Sec</small> | 🔴  <br><small>3.985 Sec</small> | 🟢  <br><small>12.413 Sec</small> |


## Userjourney

| **Test Case** |  **local:ai/qwen3** | **local:ai/gemma3** | **local:ai/smollm3** | **local:ai/smollm2** | **openai:gpt-4-turbo** |
| --- |  --- | --- | --- | --- | --- |
| Verify product page has a clear call to action |  🟢  <br><small>30.016 Sec</small> | 🔴  <br><small>7.301 Sec</small> | 🔴  <br><small>14.874 Sec</small> | 🔴  <br><small>74.245 Sec</small> | 🔴  <br><small>8.818 Sec</small> |
| Verify form guides user to the next step |  🔴  <br><small>36.084 Sec</small> | 🔴  <br><small>12.257 Sec</small> | 🔴  <br><small>23.037 Sec</small> | 🔴  <br><small>73.733 Sec</small> | 🔴  <br><small>12.078 Sec</small> |


