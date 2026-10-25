import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  // Set by the GitHub Pages workflow; e.g. "/my-repo/" for project pages.
  base: process.env.RSPRESS_BASE || '/',
  title: 'My Site',
  description: 'A multilingual Rspress documentation site.',
  lang: 'en',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'My Site',
      description: 'A multilingual Rspress documentation site.',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: '我的站点',
      description: '一个多语言 Rspress 文档站点。',
    },
  ],
  markdown: {
    link: {
      checkAnchors: true,
    },
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/web-infra-dev/rspress',
      },
    ],
  },
});
