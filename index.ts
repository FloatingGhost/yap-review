import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import {gitDiffTool} from "./tools.js";


const client = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
});

const MODEL = 'claude-sonnet-4-6';

const message = await client.beta.messages.toolRunner({
    messages: [{
        role: 'user',
        content: 'This is a test, please use the git diff tool and tell me its output, use branch name main'
    }],
    model: MODEL,
    max_tokens: 1024,
        tools: [
            gitDiffTool,
        ]
    }
)

console.log(message);