import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

export default defineConfig({
  site: 'https://help.keboola.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    starlight({
      title: 'Keboola User Documentation',
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: true,
      },
      plugins: [starlightImageZoom()],
      customCss: ['./src/styles/custom.css'],
      head: [
        // GTM head script — only for production
        {
          tag: 'script',
          content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WMTTBS');`,
        },
      ],
      sidebar: [
        // Placeholder — will be replaced by convert-nav.mjs output
        { label: 'Home', slug: '' },
      ],
      components: {
        Head: './src/components/Head.astro',
      },
      pagination: false,
      editLink: {
        baseUrl: 'https://github.com/keboola/connection-docs/edit/main/',
      },
    }),
  ],
});
