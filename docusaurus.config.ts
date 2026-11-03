import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'JNbot',
  tagline: 'Minecraft Bot Management Made Easy',
  favicon: 'icon.ico',
  onBrokenLinks: "warn",

  // Set the production url of your site here
  url: 'https://jnbot.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'JNbot', // Usually your GitHub org/user name.
  projectName: 'JNbot', // Usually your repo name.

  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        docsRouteBasePath: '/',
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Serve docs at the site root (baseUrl is already "/docs/"), so pages
          // live at /docs/intro instead of the doubled /docs/docs/intro.
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'icon.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'JNbot',
      logo: {
        alt: 'JNbot Logo',
        src: 'icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userGuideSidebar',
          position: 'left',
          label: 'User Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'pluginDevSidebar',
          position: 'left',
          label: 'Plugin Development',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceSidebar',
          position: 'left',
          label: 'Core References',
        },
        {
          to: 'https://jnbot.netlify.app/download',
          label: 'Download',
          position: 'right',
        },
        {
          href: 'https://github.com/JNbot-app',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'User Guide',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'First Steps',
              to: '/docs/getting-started/first-steps',
            },
            {
              label: 'Managing Accounts',
              to: '/docs/getting-started/alts',
            },
            {
              label: 'Server Profiles',
              to: '/docs/profiles/overview',
            },
            {
              label: 'Minecraft Servers',
              to: '/docs/minecraft/overview',
            },
            {
              label: 'AI Access (MCP)',
              to: '/docs/mcp',
            },
          ],
        },
        {
          title: 'Plugin Development',
          items: [
            {
              label: 'Plugin Overview',
              to: '/docs/plugins',
            },
            {
              label: 'Bot API',
              to: '/docs/plugins/code-based/bot',
            },
            {
              label: 'Script API',
              to: '/docs/plugins/code-based/script',
            },
            {
              label: 'Actions & Triggers',
              to: '/docs/plugins/code-based/actions',
            },
            {
              label: 'Profile UI Plugins',
              to: '/docs/plugins/profile-ui',
            },
          ],
        },
        {
          title: 'Core References',
          items: [
            {
              label: 'JNbot Client Overview',
              to: '/docs/jnbotclient/overview',
            },
            {
              label: 'Client API Reference',
              to: '/docs/jnbotclient/api',
            },
            {
              label: 'JNbot Proxy Overview',
              to: '/docs/jnbotproxy',
            },
            {
              label: 'Packet Interception',
              to: '/docs/jnbotproxy/packetmanager',
            },
            {
              label: 'Managed Server API',
              to: '/docs/minecraft/server-api',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Download',
              to: 'https://jnbot.netlify.app/download',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/JNbot-app',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JNbot, by usserwout. All Rights Reserved.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'java', 'python'],
    },
  } satisfies Preset.ThemeConfig,

  // Add Font Awesome for icons
  scripts: [
    {
      src: 'https://kit.fontawesome.com/4f61544cd8.js',
      crossorigin: 'anonymous',
    }
  ],

};

export default config;
