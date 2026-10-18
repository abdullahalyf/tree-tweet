# TreeTweet bilingual verification design

Approved in chat: preserve and import the existing land verification prototype, deliver complete Bangla/English UI, a top language toggle with Bangla as default and remembered preference, responsive polished motion, and verified existing workflows. Use three isolated agent directories and report progress in chat. User additionally authorized merging, pushing and Vercel deployment.

## Product contract
- The first screen prioritizes land/deed search and eight synthetic sample cases.
- Translate all product labels, validation, errors, result summaries, issues, demo registration, QR tools, tamper simulation and limitations. Recorded Bengali names and identifiers remain original data.
- Present sample data as synthetic; do not claim government verification or guaranteed safe ownership.
- Unknown deeds and absent evidence must never receive a reassuring green result.
- Keep fixtures immutable and preserve canonical hashing compatibility.
- Layouts must work at 390x844 and 1440x900, with visible focus, readable contrast, keyboard interaction and reduced motion.
- Use existing React/Next.js/Tailwind conventions. Root handles critical correctness, agent integration and deployment.
- Three directories only: puku1, puku2, puku3, within the approved workspace. One dependency installation and one application server to limit RAM.

## Boundaries
puku1 owns locale infrastructure and feature component copy; puku2 owns navbar, shared visual components, intro and global CSS; puku3 owns regression tests and acceptance documentation. Root owns app integration, layout, critical verification rules, services, registry, actions, configuration and deployment.

## Finish criteria
Run existing and added regression tests, TypeScript, lint, production build and browser acceptance checks. Merge and push reviewed work. Deploy through available Vercel authentication; report blockers accurately when credentials or platform access prevent deployment.
