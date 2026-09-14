# Dexter Walk Forge — Operational State

Project ID: dexter-walk-forge
Revision: 2
Current baseline: `/Users/andrew/Desktop/Dexter_Walk_Forge/index.html`

## Artifact contract
Single-file, mobile-first browser app. A user starts a walk, speaks or types unstructured product thoughts, issues natural-language decisions, and receives a continuously maintained product spec plus a complete implementation handoff prompt.

## Active invariants
- Raw walk trace is preserved locally in browser storage.
- Idea state distinguishes active ideas, committed features, critical features, merged ideas, and rejected ideas.
- Rejected ideas remain explicit non-goals in the generated implementation prompt.
- `build that`/`forge that` generates the implementation handoff rather than pretending an external build occurred.
- No account, analytics, backend, cloud persistence, or external dependency is required for the core app.
- Speech-recognition failure must leave typed capture usable.

## Evidence state
- Verified: standalone HTML has a valid doctype/closing document structure and is 19,891 bytes.
- Verified: all embedded JavaScript passes Node syntax checking.
- Verified in source: SpeechRecognition/webkitSpeechRecognition integration, localStorage persistence, command parser, prompt generation, Markdown download, clipboard handoff, and AI Studio launcher are present.
- Implemented-unverified: direct browser interaction and microphone-permission path.
- Pending verification: Android/Brave or Chrome continuous-recognition behavior during an actual walk.

## Known constraints
Web Speech API support varies by browser and may depend on browser speech services. The app degrades to typed capture when unavailable. AI Studio handoff copies the complete prompt and opens AI Studio; it does not falsely claim to auto-build without an authenticated API integration.
