# Timeforge

Timeforge is the branch-and-history companion for Dexter Walk Forge.

The primary `index.html` remains the walk-first capture tool. Timeforge begins after a walk already has useful structure: it imports Dexter Walk Forge state, preserves that state as `main`, and lets you inspect provenance, fork experiments, compare them semantically, selectively merge them, mine project memory across archived walks, and generate deterministic handoff recipes.

## Open it

Open `timeforge.html` in a browser.

Three safe starting paths are available:

1. **Import** a Dexter Walk Forge v3 backup/session JSON.
2. **Load DWF local state** when `index.html` and `timeforge.html` are being served from an origin that shares browser storage.
3. **Load demo** to exercise the branching workflow without touching a real project.

No account, backend, analytics service, or remote dependency is required.

## Source Lens

Timeforge links structured ideas back to preserved raw walk text.

- New Timeforge ideas get a durable direct raw-source ID.
- Imported ideas that already carry durable source IDs remain direct.
- Dexter Walk Forge v3 ideas predate durable raw-source IDs. Timeforge therefore uses exact-text or token-similarity matching for those imports and labels those links `inferred` instead of presenting them as certain.
- Unmatched ideas remain explicitly `unlinked`.

Selecting **Source** on an idea shows the raw source evidence plus Timeforge events that later touched that idea.

## Time Machine

Every Timeforge edit appends an immutable event and stores a full checkpoint for the active branch.

Use the timeline slider to inspect prior branch state. Historical checkpoints are read-only. To continue from one, choose **Fork from here**.

A fork copies the exact selected checkpoint. Later edits remain isolated inside that branch until a merge is requested.

## Compare and selective merge

The Compare view performs a semantic state diff rather than a text-file diff.

It distinguishes:

- added ideas/records,
- removed ideas/records,
- changed idea state such as text, status, priority, lock state, tags, dependencies, and notes.

Check only the changes you want, then merge them into the target branch. Unchecked branch changes do not leak across the merge boundary.

## Project Memory

Project Memory evaluates the current `main` state together with imported archived walks. It surfaces:

- recurring project language,
- ideas that resurface across walks,
- constraints that remain semantically stable across walks.

The analysis is deterministic and local. It does not call a model or network service.

## Forge Recipes

Recipes transform the selected branch into one of six deterministic documents:

- Build handoff
- Coding-agent task
- Issue sequence
- MVP cut
- QA matrix
- Cold-start handoff

Recipes are generated from accepted branch state, constraints, decisions, questions, later scope, non-goals, and preserved raw trace.

## Export

**Timeforge JSON** preserves branches, checkpoints, provenance, event history, imported archive, and the original root when available.

**Dexter Walk Forge JSON** writes the current `main` branch back into a v3-compatible DWF backup. Timeforge-only provenance fields are stripped from idea objects so the existing DWF importer does not inherit companion-only metadata.

## Validation

Run:

```text
node timeforge-verify.mjs
```

The verifier executes the exact `timeforge-core.js` source, parses `timeforge-ui.js` and `timeforge-app.js`, confirms `timeforge.html` uses only the three expected repo-local scripts, and checks import normalization, provenance, event/checkpoint integrity, historical immutability, branch isolation, semantic diff, selective merge, Project Memory, all six Recipes, malformed-input recovery, DWF-compatible export, and the no-remote-script/style boundary.
