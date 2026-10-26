import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

// Gives every page searchable text: its title and description, so built-in search can show
// an excerpt for each result, not only for pages whose body contains the query.
const searchText = {
  name: 'search-text',
  modifySearchIndexData(
    pages: {
      title: string;
      description?: string;
      content: string;
      _flattenContent?: string;
    }[],
  ) {
    for (const page of pages) {
      const extra = [page.title, page.description].filter(Boolean).join('. ');
      page.content = `${extra}. ${page.content}`;
    }
  },
};

export default defineConfig({
  plugins: [searchText],
  search: {
    mode: 'local',
    searchHooks: path.join(__dirname, 'theme', 'search-hooks.ts'),
  },
  root: path.join(__dirname, 'docs'),
  // Set by the GitHub Pages workflow; e.g. "/my-repo/" for project pages.
  base: process.env.RSPRESS_BASE || '/',
  title: 'JΛCØB',
  description: 'A multilingual Rspress documentation site.',
  lang: 'en',
  icon: '/pixel-avatar.png',
  logo: '/pixel-avatar.png',
  logoText: 'JΛCØB',
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'JΛCØB',
      description: 'A multilingual Rspress documentation site.',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'JΛCØB',
      description: '一个多语言 Rspress 文档站点。',
    },
  ],
  markdown: {
    link: {
      checkAnchors: true,
    },
  },
  themeConfig: {
    footer: {
      message: '© 2026 JΛCØB',
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/jacob-valor',
      },
      { icon: 'x', mode: 'link', content: 'https://x.com/' },
      { icon: 'discord', mode: 'link', content: 'https://discord.com/' },
      { icon: 'youtube', mode: 'link', content: 'https://www.youtube.com/' },
      {
        icon: { svg: readIcon('kick') },
        mode: 'link',
        content: 'https://kick.com/',
      },
      {
        icon: { svg: readIcon('hackthebox') },
        mode: 'link',
        content: 'https://app.hackthebox.com/',
      },
      {
        icon: { svg: readIcon('tryhackme') },
        mode: 'link',
        content: 'https://tryhackme.com/',
      },
      {
        icon: { svg: readIcon('hackerone') },
        mode: 'link',
        content: 'https://hackerone.com/',
      },
      {
        icon: { svg: readIcon('bugcrowd') },
        mode: 'link',
        content: 'https://www.bugcrowd.com/',
      },
    ],
  },
});

// Brand glyphs live in theme/icons; their fill is currentColor so they follow the theme.
function readIcon(name: string): string {
  return fs.readFileSync(
    path.join(__dirname, 'theme', 'icons', `${name}.svg`),
    'utf8',
  );
}
