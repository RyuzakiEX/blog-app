# Blog App

A modern, multilingual blog application built with Nuxt 3, featuring content management via markdown files with support for English and German.

## Tech Stack

- **Framework**: Nuxt 4 - Modern Vue 3 framework
- **Styling**: Nuxt UI components with Tailwind CSS
- **Content Management**: Nuxt Content - File-based CMS with markdown support and built-in git integration
- **Content Editing**: Nuxt Studio Alpha (self-hosted) - Headless CMS for collaborative content editing with live preview
- **i18n**: @nuxtjs/i18n - Multi-language support (English and German)
- **Image Optimization**: @nuxt/image
- **Hosting**: Nuxthub (WIP Migrate to Vercel)

## Setup

Install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The app will automatically reload on file changes.

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Content

Blog posts are stored as markdown files in the `content/` directory with support for multiple languages:

- **English posts**: `content/*.md`
- **German posts**: `content/de/*.md`

### Content Management

- **Markdown-based**: All content is version-controlled in git
- **Nuxt Content**: Parses and serves markdown files with full metadata support (frontmatter, etc.)
- **Nuxt Studio**: Self-hosted alpha instance for collaborative editing with real-time preview capabilities
- **Multi-language**: Content automatically organized by language subdirectories

## Internationalization

Language files are located in `i18n/locales/`:

- English: `i18n/locales/en.json`
- German: `i18n/locales/de.json`

## Nuxt Studio - Content Editing

### Accessing Nuxt Studio Aplha

1. Navigate to `domain.com/admin`
2. Log in with GitHub (OAuth app will trigger - authentication is required)
3. Press `Ctrl + .` to open the editor
4. You'll see two main tabs:
   - **Content Tab**: All blog markdown files organized by language
   - **Media Tab**: All assets, images, and uploaded files

### Adding Blogs

1. Open the editor (`Ctrl + .`) and go to the **Content Tab**
2. Click **"Create a new file"** button
3. A blank markdown file will be created
4. Follow the naming convention: `XXX.title-of-blog.md`
   - Example: `008.ai-trends.md` (increment the serial number)
   - **Important**: Create the same blog in both language folders (`content/` and `content/de/`)
5. Upload any required images via the **Media Tab**
6. Once content is complete, click **"Review Changes"** to preview
7. Commit with message: `content: add "title of the blog"`

### Editing Blogs

1. Open the editor (`Ctrl + .`) and go to the **Content Tab**
2. Click on the specific blog file you want to edit
3. Make your changes in the editor
4. Click **"Review Changes"** to preview modifications
5. Once satisfied, click **"Publish"** to commit changes
6. Commit message format: `content: edit "title of the blog"`
7. **Important**: You must edit the blog in all language versions (`content/` and `content/de/`)
8. To rename a file: Click the **hamburger menu (⋮)** on the file and select **"Edit"**

### Deleting Blogs

1. Open the editor (`Ctrl + .`) and go to the **Content Tab**
2. Find the blog file you want to delete
3. Click the **hamburger menu (⋮)** and select **"Delete"**
4. Click **"Review Changes"** to confirm deletion
5. Publish the changes
6. Commit message: `content: delete "title of the blog"`
7. **Important**: Delete the blog in all language folders to maintain consistency

## Deployment

### Automatic Deployment

The repository is linked to Vercel and will automatically build and deploy when changes are pushed:

- All commits from Development or Nuxt Studio are automatically built and deployed
- No manual intervention needed after publishing in Nuxt Studio

### Manual Deployment

If you need to manually build and deploy:

```bash
npm run build
npx vercel deploy
```
