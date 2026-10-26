import { useLang } from '@rspress/core/runtime';
import { useEffect, useRef } from 'react';
import { leftHand, rightHand } from './footerHands';
import './HomeFooter.css';

// Replaces Rspress's one-line home footer (exported from theme/index.tsx under the same name).
// Top: brand, link columns and a contact block. Middle: two ASCII hands from
// The Creation of Adam reaching across the footer.

const copy = {
  en: {
    statement: 'Jacob Valor, security researcher and full-stack developer.',
    sections: 'Sections',
    elsewhere: 'Elsewhere',
    contactHeading: 'Work with me',
    contactText: 'Pentests, bug reports and full-stack projects.',
    contact: 'Get in touch',
    links: [
      { text: 'Writeups', path: '/writeups/' },
      { text: 'CTF', path: '/ctf/' },
      { text: 'Research', path: '/research/' },
      { text: 'Projects', path: '/projects/' },
      { text: 'Blog', path: '/blog/' },
      { text: 'About', path: '/about/' },
    ],
  },
  zh: {
    statement: 'Jacob Valor，安全研究员与全栈开发者。',
    sections: '栏目',
    elsewhere: '其他平台',
    contactHeading: '合作',
    contactText: '渗透测试、漏洞报告与全栈项目。',
    contact: '联系我',
    links: [
      { text: '写作', path: '/zh/writeups/' },
      { text: 'CTF', path: '/zh/ctf/' },
      { text: '研究', path: '/zh/research/' },
      { text: '项目', path: '/zh/projects/' },
      { text: '博客', path: '/zh/blog/' },
      { text: '关于', path: '/zh/about/' },
    ],
  },
} as const;

const GITHUB = 'https://github.com/jacob-valor';

export function HomeFooter() {
  const lang: 'en' | 'zh' = useLang() === 'zh' ? 'zh' : 'en';
  const stage = useRef<HTMLDivElement>(null);

  // Hands move only with the scroll: apart while the footer comes into view, meeting at
  // their final place when the page reaches its end. Easing toward the scroll target keeps
  // wheel steps smooth. Without this script (or with reduced motion) they rest in place.
  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    let current = -1;
    let frame = 0;
    const target = () => {
      const rect = el.getBoundingClientRect();
      return Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / rect.height),
      );
    };
    const tick = () => {
      const goal = target();
      current = current < 0 ? goal : current + (goal - current) * 0.18;
      if (Math.abs(goal - current) < 0.001) current = goal;
      el.style.setProperty('--sf-p', current.toFixed(4));
      frame = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  const t = copy[lang];
  const home = lang === 'zh' ? '/zh/' : '/';
  const contactPath = lang === 'zh' ? '/zh/about/#contact' : '/about/#contact';

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <a className="site-footer__logo" href={home}>
            <img src="/pixel-avatar.png" alt="" width="28" height="28" />
            <span>JΛCØB</span>
          </a>
          <p className="site-footer__statement">{t.statement}</p>
          <a
            className="site-footer__social"
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"
              />
            </svg>
            <span className="site-footer__sr">GitHub</span>
          </a>
        </div>

        <nav className="site-footer__cols" aria-label={t.sections}>
          <div>
            <h2 className="site-footer__heading">{t.sections}</h2>
            <ul>
              {t.links.map((link) => (
                <li key={link.path}>
                  <a href={link.path}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__heading">{t.elsewhere}</h2>
            <ul>
              <li>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="site-footer__contact">
          <h2 className="site-footer__heading">{t.contactHeading}</h2>
          <p>{t.contactText}</p>
          <a className="site-footer__cta" href={contactPath}>
            {t.contact}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="site-footer__stage" ref={stage}>
        <pre
          className="site-footer__hand site-footer__hand--left"
          aria-hidden="true"
        >
          {leftHand}
        </pre>
        <pre
          className="site-footer__hand site-footer__hand--right"
          aria-hidden="true"
        >
          {rightHand}
        </pre>
      </div>
    </footer>
  );
}
