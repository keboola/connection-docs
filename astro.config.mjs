import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import starlightLlmsTxt from 'starlight-llms-txt';
import { sidebar } from './src/sidebar.mjs';
import redirectFrom from './src/integrations/redirect-from.mjs';
import beaconTransforms from './src/integrations/beacon-transforms.mjs';

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
    starlight({
      title: 'Keboola User Documentation',
      favicon: '/favicon.ico',
      logo: {
        // Dark near-black wordmark for light theme; brand-blue (#097CF7,
        // Azure Radiance) variant for dark theme so it stays legible + on-brand.
        light: './src/assets/logo.png',
        dark: './src/assets/logo-dark.png',
        replacesTitle: true,
      },
      plugins: [
        starlightImageZoom(),
        // Generates /llms.txt, /llms-full.txt, /llms-small.txt at build time
        // (llmstxt.org standard) so external AI agents and our own Ask Kai RAG
        // get a curated, structured entrypoint to the docs.
        starlightLlmsTxt({
          projectName: 'Keboola Documentation',
          description:
            'Keboola is a data platform as a service. The documentation covers ' +
            'Storage (tables, buckets, files), Transformations (SQL, Python, R, ' +
            'dbt), Components (data source and destination connectors), Flows ' +
            '(orchestration), and platform administration.',
          // Float the section indexes and the Diátaxis Transformations pilot to
          // the top of the generated output.
          promote: ['index*', 'transformations/**'],
          // Trim the small variant of the noisiest deep-reference pages.
          exclude: ['404', '**/report-presets-columns-and-pk/**'],
          // Let agents pull a single product domain at a time.
          customSets: [
            {
              label: 'Transformations',
              paths: ['transformations/**'],
              description:
                'SQL, Python, R, and dbt transformations — how-to guides, ' +
                'reference, and concepts (Diátaxis-structured).',
            },
          ],
        }),
      ],
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
        // Persist the search across view transitions (manual ClientRouter
        // otherwise swaps in a fresh, un-bound <site-search> on each nav).
        Search: './src/components/Search.astro',
      },
      pagination: true,
      editLink: {
        baseUrl: 'https://github.com/keboola/connection-docs/edit/main/',
      },
    }),
  ],
});
