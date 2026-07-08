import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import { sidebar } from './src/sidebar.mjs';
import redirectFrom from './src/integrations/redirect-from.mjs';
import pageMarkdown from './src/integrations/page-markdown.mjs';
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
    pageMarkdown(),
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
      editLink: {
        baseUrl: 'https://github.com/keboola/connection-docs/edit/main/',
      },
    }),
  ],
});
