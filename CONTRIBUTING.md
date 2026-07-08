# Contributing to Iroko Court

Thank you for your interest in contributing to **Iroko Court**.

This guide defines engineering standards, branch strategy, quality expectations, and pull request practices to keep collaboration smooth and predictable.

---

## Development Prerequisites

- Node.js >= 20
- pnpm 10+
- Git

Install dependencies from repo root:

```bash
pnpm install
```

Run local dev:

```bash
pnpm dev
```

---

## Branching Strategy

Use short-lived branches from `main`:

- `feat/<feature-name>`
- `fix/<issue-name>`
- `chore/<maintenance-task>`
- `docs/<documentation-scope>`

Examples:

- `feat/case-intake-flow`
- `fix/supabase-session-refresh`
- `docs/readme-hardening`

---

## Commit Message Convention

Use conventional, scoped commits whenever possible:

```text
feat(web): add case filters to docket view
fix(shared): guard null party name normalization
chore(repo): update turbo task outputs
```

Recommended types:

- `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`, `ci`

---

## Code Quality Requirements

Before opening a PR, ensure:

1. Code is formatted.
2. Lint checks pass.
3. Build succeeds.
4. Changes are scoped and minimal.

Run:

```bash
pnpm format
pnpm lint
pnpm build
```

---

## Pull Request Checklist

Include the following in each PR description:

- **Summary**: What changed and why
- **Scope**: Packages/apps affected
- **Validation**: Commands run and outcomes
- **Screenshots**: For UI changes
- **DB impact**: Migration or schema notes if applicable
- **Risk/Rollback**: Known risks and rollback steps

Keep PRs reviewable; prefer smaller focused changes over large mixed-purpose submissions.

---

## Monorepo Guidance

When changing shared packages (`packages/shared`, `packages/ui`, `packages/config`, `packages/database`):

- assess impact on `apps/web` and other dependents,
- avoid breaking exported APIs without migration notes,
- update docs where behavior changes.

---

## Security & Secrets

- Never commit secrets, access tokens, or private keys.
- Keep environment values in local `.env*` files and deployment secret stores.
- Sanitize logs and screenshots before sharing in PRs/issues.

---

## Reporting Bugs

When filing issues, include:

- clear reproduction steps,
- expected vs actual behavior,
- environment details (OS, Node, browser),
- logs/screenshots if relevant.

---

## Questions

If you are unsure about architecture, implementation approach, or review scope, open a draft PR early and ask for guidance.

Thanks for helping improve Iroko Court 🚀
