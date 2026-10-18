# Guided buyer experience

The first screen now explains what TreeTweet helps with and how to use it. Start leads to the paper checklist; five topic links let a returning visitor jump directly to owner identity, mutation history, cases, khas status or acquisition notices. Every section separates what to compare from where to get help, and provides next-step/all-topics links.

Preparation marks give immediate inline feedback and update a neutral preparation bar. Collecting papers explicitly does not mean verification is complete. Existing official sources and data limitations remain intact.

Motion uses existing CSS, without a new runtime dependency: gentle introduction/topic entrances, tile and button feedback, and preparation-state transitions alongside existing particles. A manual animation control disables animation/transitions and hides particles across the workspace until reload. Section/result navigation also respects that control and the browser's reduced-motion preference. OS-level reduced-motion behavior still needs hands-on confirmation.

Puku1 reviewed the onboarding copy and rural-user flow. Puku3 reviewed the diff and flagged the existing bottom-guide demo transition: focus stayed on the removed button and the viewport remained down the page. Root reproduced it, then made tab changes focus and scroll to the new main content.

## Verification

- Existing complete regression suite passed; A–H outcomes and fixture immutability unchanged. Zero-warning lint and production build passed after the navigation fix.
- Chrome at 390×844 Bangla and 1440×900 English: no horizontal overflow; first-screen start, instructions and topic controls readable.
- Start → preparation → owner worked. All five topic links and all five next links reached their intended focused sections. With motion paused, each destination top was 190px, below the approximately172px mobile header.
- Keyboard Tab from the owner section reached its official link with visible focus. New primary controls measured at least44px high; mobile topic controls about81px.
- Collected/mismatch marks showed inline feedback, 1/5 preparation count, mismatch alert and 0.2 progress transform. No clearance was issued.
- Animation pause produced zero running animations, hid particles and kept content visible. The preference remained in memory when switching between guide and demo; reload resets it.
- Bottom-guide demo navigation focused main-content and returned to the new start. Final browser console had no warnings/errors.
- Local screenshots and a structured scoped evidence record are in ignored `artifacts/guided-*` files. These observations do not establish physical-phone, camera, print, assistive-technology or full accessibility conformance.

The app remains a public guide with a separate synthetic checker. Authorized live government records/API access is still required for actual record verification.
