import { useLang } from '@rspress/core/runtime';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './AboutMenu.css';

// Adds a two-card dropdown to the "About" item of Rspress's top nav: "Contact" with a drawn
// envelope, and "About me" with the pixel avatar. The item still links to the About page.
// Rspress renders the nav, so the panel is mounted into its item.

// Longer than the other menus: the panel sits under the social icons, away from "About".
const CLOSE_DELAY_MS = 300;

type Card = {
  title: string;
  description: string;
  path: string;
  picture: 'avatar' | 'mail';
};

const cards: Record<'en' | 'zh', Card[]> = {
  en: [
    {
      title: 'Contact',
      description: 'Pentests, bug reports and collaboration.',
      path: '/about/#contact',
      picture: 'mail',
    },
    {
      title: 'About me',
      description: 'Background, certifications and what I work on.',
      path: '/about/',
      picture: 'avatar',
    },
  ],
  zh: [
    {
      title: '联系',
      description: '渗透测试、漏洞报告与合作。',
      path: '/zh/about/#contact',
      picture: 'mail',
    },
    {
      title: '关于我',
      description: '背景、证书与我的工作内容。',
      path: '/zh/about/',
      picture: 'avatar',
    },
  ],
};

function findAboutItem(): HTMLLIElement | null {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    '.rp-nav .rp-nav-menu__item > a',
  )) {
    const path = new URL(link.href).pathname.replace(/^\/zh(?=\/)/, '');
    if (path.startsWith('/about')) return link.parentElement as HTMLLIElement;
  }
  return null;
}

const pictures: Record<Card['picture'], ReactNode> = {
  avatar: <img src="/pixel-avatar.png" alt="" className="am-card__img" />,
  mail: (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      className="am-card__img am-card__mail"
    >
      <rect
        x="40"
        y="38"
        width="120"
        height="80"
        rx="10"
        className="am-mail__body"
      />
      <path d="M44 46 L100 88 L156 46" className="am-mail__flap" />
    </svg>
  ),
};

export function AboutMenu() {
  const lang: 'en' | 'zh' = useLang() === 'zh' ? 'zh' : 'en';
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Attach to Rspress's "About" nav item: a container for the panel, plus hover,
  // focus and Escape handling on the whole item (the link and the panel).
  // biome-ignore lint/correctness/useExhaustiveDependencies: a language switch re-renders the nav, so re-attach to the new item
  useEffect(() => {
    const item = findAboutItem();
    if (!item) return;
    const link = item.querySelector<HTMLAnchorElement>(':scope > a');
    const container = document.createElement('div');
    container.className = 'am-host';
    item.classList.add('am-item');
    item.append(container);
    link?.setAttribute('aria-haspopup', 'true');
    setHost(container);

    let timer: number | undefined;
    const show = () => {
      window.clearTimeout(timer);
      setOpen(true);
    };
    const hide = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(false), delay);
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') show();
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hide(CLOSE_DELAY_MS);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!item.contains(event.relatedTarget as Node | null)) hide(0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide(0);
        link?.focus();
      }
    };

    item.addEventListener('pointerenter', onEnter);
    item.addEventListener('pointerleave', onLeave);
    item.addEventListener('focusin', show);
    item.addEventListener('focusout', onFocusOut);
    item.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      item.removeEventListener('pointerenter', onEnter);
      item.removeEventListener('pointerleave', onLeave);
      item.removeEventListener('focusin', show);
      item.removeEventListener('focusout', onFocusOut);
      item.removeEventListener('keydown', onKeyDown);
      item.classList.remove('am-item', 'am-item--open');
      link?.removeAttribute('aria-haspopup');
      link?.removeAttribute('aria-expanded');
      container.remove();
      setHost(null);
    };
  }, [lang]);

  // Place the panel under the social icons: its right edge lines up with theirs.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const el = panel.current;
      const item = host?.parentElement;
      const anchor =
        document.querySelector('.rp-nav .rp-social-links') ??
        document.querySelector('.rp-nav__right');
      if (!el || !item || !anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      // Rspress hides the social icons on narrower screens; then stay under "About".
      const shift =
        anchorRect.width > 0
          ? anchorRect.right - item.getBoundingClientRect().right
          : 0;
      el.style.setProperty('--am-shift', `${shift}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, host]);

  // Mirror the open state on the nav item (chevron) and its link (assistive tech).
  useEffect(() => {
    const item = host?.parentElement;
    item?.classList.toggle('am-item--open', open);
    item
      ?.querySelector(':scope > a')
      ?.setAttribute('aria-expanded', String(open));
  }, [host, open]);

  if (!host) return null;

  return createPortal(
    <div ref={panel} className={open ? 'am-panel am-panel--open' : 'am-panel'}>
      {cards[lang].map((card) => (
        <a
          key={card.path}
          className="am-card"
          href={card.path}
          onClick={() => setOpen(false)}
        >
          <span
            className={`am-card__picture am-card__picture--${card.picture}`}
          >
            {pictures[card.picture]}
          </span>
          <span className="am-card__title">{card.title}</span>
          <span className="am-card__desc">{card.description}</span>
        </a>
      ))}
    </div>,
    host,
  );
}
