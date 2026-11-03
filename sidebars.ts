import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userGuideSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/first-steps', 'getting-started/alts'],
    },
    {
      type: 'category',
      label: 'Server profiles',
      collapsed: false,
      items: ['profiles/overview', 'profiles/wizard', 'profiles/managing'],
    },
    {
      type: 'category',
      label: 'Record and replay tasks',
      collapsed: false,
      items: ['plugins/recordings'],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'minecraft/overview',
        'mcp',
        'storage',
        'features/cooldowns',
        'features/chains',
      ],
    },
  ],

  pluginDevSidebar: [
    'plugins/overview',
    {
      type: 'category',
      label: 'Bot scripting',
      collapsed: false,
      items: [
        'plugins/code-based/bot',
        'plugins/code-based/script',
        'plugins/code-based/actions',
        'plugins/code-based/action-options',
        'plugins/code-based/local-ai',
      ],
    },
    'plugins/profile-ui',
  ],

  referenceSidebar: [
    {
      type: 'category',
      label: 'JNbot client',
      collapsed: false,
      items: [
        'jnbotclient/overview',
        'jnbotclient/api',
        'jnbotclient/events',
        'jnbotclient/examples',
      ],
    },
    {
      type: 'category',
      label: 'JNbot Proxy',
      collapsed: false,
      items: [
        'jnbotproxy/index',
        'jnbotproxy/proxy-server',
        'jnbotproxy/sessions',
        'jnbotproxy/packetmanager',
        'jnbotproxy/pluginmanager',
        'jnbotproxy/recorder',
        'jnbotproxy/examples',
      ],
    },
    {
      type: 'category',
      label: 'Managed servers',
      collapsed: false,
      items: ['minecraft/server-api'],
    },
  ],
};

export default sidebars;
