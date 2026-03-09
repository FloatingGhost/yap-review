import { z } from 'zod';
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';

export const gitDiffTool = betaZodTool({
    name: 'git_diff',
    description: 'Get the git diff for the current branch',
    inputSchema: z.object({
        branch: z.string(),
    }),
    run: () => {
        return "There was an error generating the diff"
    },
})