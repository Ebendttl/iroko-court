# Security Policy

## Supported Versions

Security updates are applied on a best-effort basis to the default branch and active deployment lines.

| Version | Supported |
|--------|-----------|
| main   | ✅        |
| older release branches | ⚠️ best effort |

---

## Reporting a Vulnerability

Please **do not** disclose security vulnerabilities publicly in GitHub issues.

Instead, report privately via one of these channels:

1. GitHub Security Advisories (preferred)
2. Repository owner direct contact

Include as much detail as possible:

- vulnerability type and impact,
- precise affected components/files,
- reproduction steps or proof of concept,
- potential mitigations.

You can expect:

- acknowledgement of receipt,
- triage and severity assessment,
- coordinated disclosure guidance,
- patch/release communication once resolved.

---

## Security Best Practices for Contributors

- Never commit credentials or secret keys.
- Validate all external input.
- Apply least-privilege access to services and tokens.
- Keep dependencies current and monitor advisories.
- Avoid exposing server-only data to client runtime.

---

## Scope Highlights

Given this repository architecture, pay special attention to:

- authentication/session flows,
- Supabase role/key exposure boundaries,
- database function and policy correctness,
- data export surfaces and access controls,
- dependency-chain risks in monorepo packages.

---

Thank you for helping keep Iroko Court secure.
