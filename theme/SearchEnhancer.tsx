import { useEffect } from 'react';
import './SearchEnhancer.css';

// Adds two things Rspress's built-in search does not show: a section tag on each result,
// and a "N results" label above the list. Rspress renders the results, so this only
// decorates what it already draws. It does not change how results are found.

const SECTIONS: Record<'en' | 'zh', Record<string, string>> = {
  en: {
    writeups: 'Writeups',
    ctf: 'CTF',
    research: 'Research',
    projects: 'Projects',
    blog: 'Blog',
    about: 'About',
  },
  zh: {
    writeups: '写作',
    ctf: 'CTF',
    research: '研究',
    projects: '项目',
    blog: '博客',
    about: '关于',
  },
};

function enhance(): void {
  const modal = document.querySelector<HTMLElement>('.rp-search-panel__modal');
  const results = document.querySelector<HTMLElement>(
    '.rp-search-panel__results',
  );
  if (!modal || !results) return;

  const zh = window.location.pathname.startsWith('/zh/');
  const lang = zh ? 'zh' : 'en';
  const items = [...results.querySelectorAll<HTMLElement>('.rp-suggest-item')];

  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>(
      '.rp-suggest-item__link',
    );
    const row = item.querySelector<HTMLElement>('.rp-suggest-item__container');
    if (!link || !row || row.querySelector('.search-tag')) continue;

    const segments = new URL(link.href).pathname
      .replace(/^\/zh(?=\/)/, '')
      .split('/')
      .filter(Boolean);
    const label = SECTIONS[lang][segments[0] ?? ''];
    if (!label) continue;

    const tag = document.createElement('span');
    tag.className = 'search-tag';
    tag.textContent = label;
    row.querySelector('.rp-suggest-item__action-icon')?.before(tag);
  }

  let count = modal.querySelector<HTMLElement>('.search-count');
  if (!count) {
    count = document.createElement('p');
    count.className = 'search-count';
    results.before(count);
  }
  // Only write when the text changes: writing the same text would re-trigger the observer.
  const text =
    items.length === 0
      ? ''
      : zh
        ? `${items.length} 条结果`
        : items.length === 1
          ? '1 result'
          : `${items.length} results`;
  if (count.textContent !== text) count.textContent = text;
}

export function SearchEnhancer() {
  useEffect(() => {
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    enhance();
    return () => observer.disconnect();
  }, []);
  return null;
}
