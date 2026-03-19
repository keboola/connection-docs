import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import { sidebar } from './src/sidebar.mjs';
import redirectFrom from './src/integrations/redirect-from.mjs';

export default defineConfig({
  site: 'https://help.keboola.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    redirectFrom(),
    starlight({
      title: 'Keboola User Documentation',
      favicon: '/favicon.ico',
      logo: {
        src: './src/assets/logo.png',
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
      },
      pagination: false,
      editLink: {
        baseUrl: 'https://github.com/keboola/connection-docs/edit/main/',
      },
    }),
  ],
});
