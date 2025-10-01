# Contributing to Zinima (zine-scroll-storytelling-platform)

Thank you for your interest in improving Zinima! We welcome contributions during Hacktoberfest and beyond.

## Before You Begin

1. **Read the Code of Conduct** in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
2. **Look for issues** labeled `good first issue`, `help wanted`, or `hacktoberfest`.
3. For large changes, **open an issue first** to discuss scope and approach.

## Tech Stack

- Next.js 14 (App Router) & TypeScript  
- Framer Motion & GSAP ScrollTrigger  
- Tailwind CSS  
- Optional: Three.js (react-three-fiber)

## Local Setup

```bash
# Fork the repo and clone your fork
git clone https://github.com/your-username/zine-scroll-storytelling-platform.git
cd zine-scroll-storytelling-platform

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Visit http://localhost:3000
```

## Branching & Workflow

- Create branches from `main`:
  ```bash
  git checkout -b feat/your-short-description
  ```
- Keep PRs **small**, **focused**, and **atomic**.
- Rebase or merge latest `main` before your PR.

## Coding Standards

- **Type safety**: Use strict TypeScript types where practical.  
- **Lint & type-check** before committing:
  ```bash
  npm run lint
  npm run type-check
  ```
- **Accessibility**: Ensure keyboard navigation, ARIA attributes, and color contrast.
- **Performance**: Favor transforms/opacity, avoid layout thrash; test with Lighthouse.

## Commit Messages

Follow **Conventional Commits**:

- `feat:` a new feature  
- `fix:` a bug fix  
- `docs:` documentation changes  
- `chore:` build/process changes  

Example:
```
feat: add minimal narrative zine template
```

## Pull Request Guidelines

1. **Link related issue** (e.g., “Closes #12”).
2. **Describe changes** and rationale.
3. **Include screenshots/GIFs** for UI updates.
4. **Outline testing steps** and edge cases covered.
5. Confirm:
   - Lint passes (`npm run lint`)
   - Type-check passes (`npm run type-check`)
   - No console errors

## Hacktoberfest Notes

- Issues labeled **`hacktoberfest`**, **`good first issue`**, or **`help wanted`** are welcome.  
- Valid contributions may be merged, approved, or labeled **`hacktoberfest-accepted`**.  
- Spam or low-effort PRs will be closed with **`spam`** or **`invalid`** labels.

## License

By contributing, you agree your work will be licensed under the MIT License.
