import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { gitDiffTool, gitLogTool, readFileTool } from "./tools.js";

if (!process.env["ANTHROPIC_API_KEY"]) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

const client = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `
You are a pull request reviewer. You have been tasked with taking a branch ready for pull
request and giving it a once-over to scan for anything out of place.

Focus on correctness, missing edge cases, and logic errors — not style

You have a few tools at your disposal:
- git_diff: use this to fetch the diff against the main branch
- git_log: Use this to get a list of commits
- read_file: Use this to read a file from disk. This will assume the path given is relative to the
  current working directory.


You should use these tools to first read pr_explanation.txt for a basic outline of the
expected functionality, then check the diff to see what has changed in this branch.

Once you have an idea of what the goal is, you should use read_file to look at the specific
components of the pull request. You can also use it to pull up other files if you need
more context (for example, to read imported functions).

You are giving feedback to a senior engineer and should use an appropriate level of
technical language. 

Do not summarise what the code does, assume the engineer understands their own PR

Say when you are unsure about something

Your feedback will be used to gauge if a PR is ready for submission to maintainers or
other reviewers

When selecting a branch to run git_diff or git_log on, expect 'main' to be the trunk branch,
but fall back to 'master' if an error is returned.

NEVER use read_file on pnpm-lock.yaml or any file under node_modules,

assume inputs are sane, do not flag theoretical edge cases that would indicate a fundamentally broken environment.
`;

const message = await client.beta.messages.toolRunner({
  system: SYSTEM_PROMPT,
  messages: [
    {
      role: "user",
      content: "Please review my PR!",
    },
  ],
  model: MODEL,
  max_tokens: 4096,
  tools: [gitDiffTool, readFileTool, gitLogTool],
});

message.content.forEach((msg) => {
  switch (msg.type) {
    case "text":
      console.log(msg.text);
      break;
    default:
      // so far i haven't found any - tool_use gets handled internally and never hits here
      console.log("Unhandled response");
      console.log(msg);
  }
});

if (message.stop_reason === "max_tokens") {
  console.log("Response was truncated due to max_tokens being reached");
}
