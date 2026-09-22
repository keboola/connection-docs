import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import { sidebar } from './src/sidebar.mjs';
import redirectFrom from './src/integrations/redirect-from.mjs';
import pageMarkdown from './src/integrations/page-markdown.mjs';
import beaconTransforms from './src/integrations/beacon-transforms.mjs';

/* Shared so the llms.txt heading cannot drift from the site's own title. */
const SITE_TITLE = 'Keboola User Documentation';

export default defineConfig({
  site: 'https://help.keboola.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [beaconTransforms],
  },
  integrations: [
    redirectFrom(),
    pageMarkdown({ siteTitle: SITE_TITLE }),
    starlight({
      title: SITE_TITLE,
      favicon: '/favicon.ico',
      // We ship our own 404 (src/pages/404.astro) so it can drop the doc-page
      // chrome and host the InkDash game. Without this, Starlight's built-in
      // routes/static/404.astro collides with it — currently a warning, a hard
      // error in later Astro versions.
      disable404Route: true,
      logo: {
        // Dark near-black wordmark for light theme; brand-blue (#097CF7,
        // Azure Radiance) variant for dark theme so it stays legible + on-brand.
        light: './src/assets/logo.png',
        dark: './src/assets/logo-dark.png',
        replacesTitle: true,
      },
      plugins: [starlightImageZoom()],
      customCss: ['./src/styles/custom.css'],
      head: [
        // GTM head script — only fires on help.keboola.com (not localhost/preview)
        {
          tag: 'script',
          content: `if(location.hostname==='help.keboola.com'){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WMTTBS');}`,
        },
      ],
      sidebar,
      components: {
        Head: './src/components/Head.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
        // Adds a header link to the Keboola API reference (api.keboola.com).
        SocialIcons: './src/components/SocialIcons.astro',
      },
      pagination: true,
      // lastUpdated is deliberately OFF. PageTitle.astro renders an
      // "Updated <date>" line when Starlight supplies one, and Starlight takes
      // that date from each file's last commit — so it needs real git history.
      // Turning it on was tried and reverted: the production build on Vercel
      // clones shallow, Starlight's getLastUpdated catches the lookup error and
      // returns undefined, and the line renders on no page at all. Verified on
      // the preview for PR #1132.
      //
      // To switch it on, the build must first have full history. Vercel has no
      // documented clone-depth setting, so that means a `git fetch --unshallow`
      // ahead of `astro build` (vercel.json `buildCommand`, or the project's
      // build command) — confirm it on a preview before re-adding this, and
      // restore `fetch-depth: 0` in .github/workflows/*.yml at the same time.
      editLink: {
        baseUrl: 'https://github.com/keboola/connection-docs/edit/main/',
      },
    }),
    // Must come AFTER starlight() so MDX code blocks use astro-expressive-code.
    // GFM has to be asked for explicitly here. Without it, MDX pages render
    // pipe tables as literal text — visible corruption, and the reason no page
    // could safely be converted from .md before now.
    mdx({ gfm: true }),
  ],
});
