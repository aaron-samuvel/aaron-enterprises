# Codex contribution workflow

When Aaron starts a Codex work session in this repository and has not given a specific task:

1. Check the working tree, open project issues, and the README roadmap. Preserve any existing user changes.
2. Choose one clearly scoped, useful, low-risk item from the project backlog and complete it. Prefer work that improves the customer experience, accessibility, correctness, or maintainability.
3. Run `npm run build`. Fix build failures caused by the change before committing.
4. Commit completed, build-verified work with a short, descriptive message.

Do not make empty commits or invent a change just to produce a commit. If there is no worthwhile, well-scoped item, report that and leave the repository unchanged. Do not include unrelated user changes in a commit. Do not merge or deploy automatically.
