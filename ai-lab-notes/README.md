# AI Lab Notes

A small beginner-friendly Vite app for tracking setup tasks, reviewing Linux and Git commands, and saving fictional lab notes in the browser.

The app uses no external APIs or paid services. Checklist progress and lab notes are stored only in the current browser's `localStorage`. Do not enter passwords, access tokens, or private information.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Git (for version control and GitHub deployment)

Check your installation:

```bash
node --version
npm --version
git --version
```

## Install and run

From this project folder:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

## Build and preview

Create a production build:

```bash
npm run build
```

The generated site is placed in `dist/`. Test it locally with:

```bash
npm run preview
```

## Publish to GitHub

1. Create an empty repository on GitHub. Do not add a README or other starter files.
2. In this folder, review the files and create the first commit:

   ```bash
   git status
   git add .
   git commit -m "Build AI Lab Notes app"
   ```

3. Connect your repository and push. Replace the example with your repository URL:

   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/ai-lab-notes.git
   git push -u origin main
   ```

If an `origin` remote already exists, update it instead:

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/ai-lab-notes.git
```

Never commit credentials, tokens, `.env` files, or private data.

## Deploy to Vercel

1. Push the project to GitHub using the steps above.
2. Sign in to [Vercel](https://vercel.com/) and select **Add New → Project**.
3. Import the GitHub repository.
4. Vercel should detect Vite automatically. Confirm these settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Select **Deploy**.

No environment variables are required. Future pushes to the connected branch will trigger new deployments.

## Project structure

```text
ai-lab-notes/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── style.css
└── README.md
```
