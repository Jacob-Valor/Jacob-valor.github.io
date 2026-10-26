import { useLang } from '@rspress/core/runtime';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import './ProductMenu.css';
import { type IconName, type MenuItem, productMenu } from './menuData';

const copy = {
  en: { open: 'Open site menu', prefix: '' },
  zh: { open: '打开站点菜单', prefix: '/zh' },
} as const;

// Grace period so the pointer can cross the gap between trigger and panel.
const CLOSE_DELAY_MS = 150;

function Glyph({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons: Record<IconName, ReactNode> = {
  writeups: (
    <Glyph size={20}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M9.5 12h5M9.5 16h5" />
    </Glyph>
  ),
  blog: (
    <Glyph size={20}>
      <path d="M4 20l1-4L16 5l3 3L8 19z" />
    </Glyph>
  ),
  ctf: (
    <Glyph size={20}>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </Glyph>
  ),
  research: (
    <Glyph size={20}>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </Glyph>
  ),
  projects: (
    <Glyph size={20}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </Glyph>
  ),
  about: (
    <Glyph size={20}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </Glyph>
  ),
  github: (
    <Glyph size={20}>
      <path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.5a3 3 0 0 0-1-2.5c3 0 6-1 6-5a4.6 4.6 0 0 0-1-3 4.3 4.3 0 0 0-.1-3s-1-.3-3.2 1.2a11 11 0 0 0-6 0C7 3 6 3.3 6 3.3a4.3 4.3 0 0 0-.1 3 4.6 4.6 0 0 0-1 3c0 4.9 3 5 6 5a3 3 0 0 0-1 2.5V21" />
    </Glyph>
  ),
};

function Entry({
  item,
  prefix,
  nested,
  onPick,
}: {
  item: MenuItem;
  prefix: string;
  nested?: boolean;
  onPick: () => void;
}) {
  const href = item.url ?? `${prefix}${item.path ?? '/'}`;
  const external = Boolean(item.url);
  return (
    <li>
      <a
        className={nested ? 'pm__item pm__item--nested' : 'pm__item'}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onPick}
      >
        <span className="pm__icon">{icons[item.icon]}</span>
        <span className="pm__text">
          <span className="pm__title">{item.title}</span>
          <span className="pm__desc">{item.description}</span>
        </span>
        {external ? (
          <span className="pm__ext">
            <Glyph size={14}>
              <path d="M7 17L17 7M9 7h8v8" />
            </Glyph>
          </span>
        ) : null}
      </a>
      {item.children ? (
        <ul className="pm__children">
          {item.children.map((child) => (
            <Entry
              key={child.title}
              item={child}
              prefix={prefix}
              nested
              onPick={onPick}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function ProductMenu() {
  const lang: 'en' | 'zh' = useLang() === 'zh' ? 'zh' : 'en';
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Mouse: open on enter, close shortly after leave. Touch and pen ignore hover.
  const onPointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    hovering.current = true;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    hovering.current = false;
    closeTimer.current = window.setTimeout(
      () => setOpen(false),
      CLOSE_DELAY_MS,
    );
  };

  return (
    <div
      className="pm"
      ref={root}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <button
        type="button"
        className="pm__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={copy[lang].open}
        // A hover already opened the panel; a click then must not close it.
        onClick={() => {
          if (!hovering.current) setOpen((value) => !value);
        }}
      >
        <Glyph size={14}>
          <path d="M5 9l7 7 7-7" />
        </Glyph>
      </button>
      {open ? (
        <div id={panelId} className="pm__panel">
          {productMenu[lang].columns.map((column) => (
            <section key={column.heading} className="pm__col">
              <h3 className="pm__heading">{column.heading}</h3>
              <ul className="pm__list">
                {column.items.map((item) => (
                  <Entry
                    key={item.title}
                    item={item}
                    prefix={copy[lang].prefix}
                    onPick={() => setOpen(false)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
