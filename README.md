# Yet another PR Review Thing

I am self-conscious about my PR submissions. I want a funny little LLM to give them
a once-over and shout at me before i waste valuable human time on review.

Very easy thing

```bash
pnpm i
pnpm build
ln -s dist/bully-me /usr/local/bin # or wherever
cd to/wherever/
bully-me
```

Then shove `ANTHROPIC_API_KEY` in your env somewhere.

Despite calling an LLM this repository is pure artisan handmade code
by real human beans.

behold anxiety given form

i no support this teehee i just wanted to push it :)

## Example run for you weirdos

``````
TOOL: read_file pr_explanation.txt
Normalised to /var/home/user/dev/pr-review/pr_explanation.txt
TOOL: git_log
TOOL: git_diff
TOOL: read_file tools.ts
Normalised to /var/home/user/dev/pr-review/tools.ts
TOOL: read_file rollup.config.js
Normalised to /var/home/user/dev/pr-review/rollup.config.js
TOOL: read_file index.ts
Normalised to /var/home/user/dev/pr-review/index.ts
TOOL: read_file package.json
Normalised to /var/home/user/dev/pr-review/package.json
Here's my review:

---

## PR Review

Overall this is solid work — the core agentic loop is clean and the tool implementations are reasonable. A few things worth calling out:

### 🐛 Bug: `git diff` three-dot vs two-dot notation

In `gitDiffTool`, you're using `git diff ${branchName}...HEAD` (three dots). Three-dot diff shows changes since the common ancestor, which is the right semantic for PRs — but only if `branchName` refers to the *base* branch (e.g. `main`). The system prompt instructs the model to pass the trunk branch name, so this is actually correct. However, the tool description says *"using HEAD as the reference point"* without clarifying directionality, so the model could potentially pass the *current* branch instead of the base, producing an empty or nonsensical diff. Tightening the description (e.g. *"pass the base/trunk branch name"*) would reduce ambiguity.

(it continues for a long time)
```
