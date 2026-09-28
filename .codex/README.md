# IndianRenters website workspace

This folder is an independent Git repository for the storefront (`frontend`), admin panel (`admin`), and API (`backend`). Its parent content repository has a separate history.

## Working on the site

1. Create a `codex/<short-topic>` branch before a new change.
2. Trace editable storefront content through the admin form, CMS API, and frontend consumer. Keep the source of truth in the CMS when the content is meant to be managed there.
3. Use the existing Mona Sans and brand tokens. New UI icons should come from Phosphor or Heroicons.
4. For each changed package, run `npm ci`, `npm run build` where available, and `npm audit --audit-level=high`. Test the affected screen at desktop and mobile widths.
5. Review `git diff --check` and the staged diff before committing. Commit one coherent change at a time. Never commit `.env*`, keys, customer data, or build output.

## Local URLs

Run `npm run dev` in `frontend` for port 3000 and in `admin` for port 3001. Run `npm run dev` in `backend` with its own local environment to use the real API. Without that API, some CMS-driven areas have no data.

## Featured Showcase products

In the admin panel, open **Dashboard → CMS → Homepage → Featured Showcase**. Each banner slide has a **Products for slide** picker for up to two products. Save the homepage CMS changes after selecting them. The API stores the product IDs with that slide, and the storefront reads those IDs when the slide is active. If the picker is empty, the storefront tries matching catalog products to the slide category. Products must already exist in the catalog to be selectable.

## Recover a change

`git log --oneline` lists checkpoints. `git revert <commit>` creates a safe undo commit while keeping later history. To inspect an old version without changing the current branch, use `git show <commit>:path/to/file`.

## Security boundary

Dependency auditing and the baseline response headers are automated checks, not a complete security review. Before production deployment, verify environment variables, authentication and authorization, upload handling, payment callbacks, CORS, and content security policy in the deployed environment. Review every major dependency upgrade and keep lockfiles in sync with manifests.
