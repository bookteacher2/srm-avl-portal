# ▶ Run this project on StackBlitz (zero local install)

StackBlitz runs Next.js **entirely in your browser** — no Node.js, no pnpm, and
no Git needed on your computer. This project is already configured for it
(`.stackblitzrc` auto-installs dependencies and starts the dev server).

You only need a **web browser** and a free **GitHub** account.

---

## Easiest path: GitHub (web) → StackBlitz

### Step 1 — Create an empty GitHub repository (in the browser)

1. Go to **https://github.com/new**
2. **Repository name:** `srm-avl-portal`
3. Visibility: **Private** (or Public)
4. **Do NOT** tick “Add a README”, “.gitignore”, or “license” — keep it empty.
5. Click **Create repository**.

### Step 2 — Upload the project files (drag & drop, no Git)

1. On the new empty repo page, click **“uploading an existing file”**
   (or **Add file → Upload files**).
2. Open the `srm-avl-portal` folder on your computer, select **everything
   inside it** (the `src` folder, `package.json`, `README.md`, all config files,
   including the ones starting with a dot like `.stackblitzrc` and
   `.gitignore`), and **drag them onto the GitHub upload area**.
   - GitHub keeps the folder structure automatically.
   - Tip: if dotfiles are hidden, enable “show hidden files” in your file
     explorer (Windows: View → Show → Hidden items).
3. Scroll down and click **Commit changes**.

### Step 3 — Open it in StackBlitz (one click)

Open this URL in your browser (replace `<your-username>`):

```
https://stackblitz.com/github/<your-username>/srm-avl-portal
```

StackBlitz will:
- import the repo,
- run `npm install`,
- start the app with `npm run dev`,
- and show a **live preview** on the right.

First boot takes ~1–2 minutes while dependencies install. That’s it — the
prototype is running with no local installation.

---

## Add a one-click “Open in StackBlitz” button

Once the repo exists, anyone can launch it from the README button. Edit the URL
in `README.md` to use your username, or share this link directly:

```
https://stackblitz.com/github/<your-username>/srm-avl-portal
```

You can also deep-link to a starting file, e.g. the landing page:

```
https://stackblitz.com/github/<your-username>/srm-avl-portal?file=src/app/(public)/page.tsx
```

---

## Using it once it’s running

- Click the **quick-login** buttons on the `/login` screen (no password).
  - Supplier view: `contact@sunnivasolar.co.th`
  - Procurement view: `procurement@epc-procurement.co.th`
- Everything runs on realistic mock data — no backend or database required.

---

## Notes & troubleshooting

| Issue | Fix |
| --- | --- |
| Dotfiles (`.stackblitzrc`, `.gitignore`) didn’t upload | Enable hidden files in your OS file explorer, then drag them in. `.stackblitzrc` is what makes StackBlitz auto-run. |
| Preview didn’t start | In the StackBlitz terminal, run `npm run dev`. |
| “Port already in use” | Click the refresh icon on the StackBlitz preview pane. |
| Slow first load | Normal — the initial `npm install` + Next.js build happens in-browser once. |
| Want a fresh copy to edit freely | Click **Fork** in the StackBlitz toolbar. |

> StackBlitz uses **npm** automatically (there’s no pnpm requirement). No
> environment variables are needed — the app defaults to mock data.
