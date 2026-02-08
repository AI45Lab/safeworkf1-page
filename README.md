# Technical Report (GitHub Pages)

Static site for a technical report. Styled like a clean GitHub-style page.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit http://localhost:8000

## Deploy to GitHub Pages

### Option A: Deploy from a branch (simplest)

1. Create a repo (e.g. `yourname/f1.5-page`) and push this folder.
2. In the repo go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Branch: **main** (or **master**), folder: **/ (root)**.
5. Save. The site will be at `https://yourname.github.io/f1.5-page/`.

### Option B: Deploy with GitHub Actions

1. Create a repo and push this folder (including `.github/workflows/deploy.yml`).
2. In the repo go to **Settings → Pages**.
3. Under **Source**, choose **GitHub Actions** (not “Deploy from a branch”).
4. Every push to `main` will run the workflow and update the site.

The `.nojekyll` file disables Jekyll so GitHub serves your static files as-is.

## Using your LaTeX report

1. Convert to HTML:  
   `pandoc report.tex -o report.html --standalone --mathjax`
2. Copy the **body** content from `report.html` into the `<main class="content">` section in `index.html` (replace the placeholder sections).
3. Put chart images in `assets/` and fix `src` paths in the pasted HTML.
