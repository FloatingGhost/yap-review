import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import child_process from "node:child_process";
import fs from "node:fs";

export const gitDiffTool = betaZodTool({
  name: "git_diff",
  description: "Get the git diff for the current branch, using HEAD as the reference point",
  inputSchema: z.object({
    branchName: z.string(),
  }),
  run: ({ branchName }) => {
    console.log("TOOL: git_diff");
    try {
      const data = child_process.spawnSync("git", ["diff", `${branchName}...HEAD`]);
      if (data.status !== 0) {
        console.log(data.stdout.toString('utf-8'));
        console.error(data.stderr.toString('utf-8'));
        const signal = data.signal ?? 'None';
        return `Running git diff returned a non-zero exit code (signal: ${signal})`;
      }

      return data.stdout.toString('utf-8');
    } catch (err) {
      if (err instanceof Error) {
          console.error(err.message);
          return `Error fetching diff: ${err.message}}`
      } else {
          return "An error occurred fetching the diff";
      }
    }
  },
});

export const gitLogTool = betaZodTool({
  name: "git_log",
  description: "Get the git log for the current branch",
  inputSchema: z.object({}),
  run: () => {
    console.log("TOOL: git_log");
    try {
      return child_process.execSync("git log --oneline -n50").toString();
    } catch (error) {
      console.error(error);
      return "An error occurred fetching the log";
    }
  },
});

export const readFileTool = betaZodTool({
  name: "read_file",
  description: "Read a file from disk",
  inputSchema: z.object({
    filePath: z.string(),
  }),
  run: (opts) => {
    // runs only locally on the developer machine, so we don't care that
    // much if it can read externally.
    console.log(`TOOL: read_file ${opts.filePath}`);
    try {
      const data = fs.readFileSync(opts.filePath);
      return data.toString();
    } catch (error) {
      console.error(error);
      if (error instanceof Error && "code" in error) {
        switch (error.code) {
          case "ENOENT":
            return `The file ${opts.filePath} does not exist`;
          case "EISDIR":
            return `The path ${opts.filePath} is a directory`;
          default:
            console.log(error.message);
            return `An unexpected error occurred reading ${opts.filePath}`;
        }
      }
      return "An unknown error occurred.";
    }
  },
});
