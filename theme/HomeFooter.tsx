import { useLang } from '@rspress/core/runtime';
import './HomeFooter.css';

// Replaces Rspress's one-line home footer (exported from theme/index.tsx under the same name).
// A designed close: what the site is, where to go next, and the name set full width.

const copy = {
  en: {
    statement: 'Jacob Valor, security researcher and full-stack developer.',
    contact: 'Get in touch',
    sections: 'Sections',
    elsewhere: 'Elsewhere',
    links: [
      { text: 'Writeups', path: '/writeups/' },
      { text: 'CTF', path: '/ctf/' },
      { text: 'Research', path: '/research/' },
      { text: 'Projects', path: '/projects/' },
      { text: 'Blog', path: '/blog/' },
      { text: 'About', path: '/about/' },
    ],
    built: 'Built with Rspress',
  },
  zh: {
    statement: 'Jacob Valor，安全研究员与全栈开发者。',
    contact: '联系我',
    sections: '栏目',
    elsewhere: '其他平台',
    links: [
      { text: '写作', path: '/zh/writeups/' },
      { text: 'CTF', path: '/zh/ctf/' },
      { text: '研究', path: '/zh/research/' },
      { text: '项目', path: '/zh/projects/' },
      { text: '博客', path: '/zh/blog/' },
      { text: '关于', path: '/zh/about/' },
    ],
    built: '使用 Rspress 构建',
  },
} as const;

const elsewhere = [{ text: 'GitHub', url: 'https://github.com/jacob-valor' }];

export function HomeFooter() {
  const lang: 'en' | 'zh' = useLang() === 'zh' ? 'zh' : 'en';
  const t = copy[lang];
  const contactPath = lang === 'zh' ? '/zh/about/#contact' : '/about/#contact';

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__intro">
            <p className="site-footer__statement">{t.statement}</p>
            <a className="site-footer__cta" href={contactPath}>
              {t.contact}
            </a>
          </div>

          <nav className="site-footer__cols" aria-label={t.sections}>
            <div className="site-footer__col">
              <h2 className="site-footer__heading">{t.sections}</h2>
              <ul>
                {t.links.map((link) => (
                  <li key={link.path}>
                    <a href={link.path}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__col">
              <h2 className="site-footer__heading">{t.elsewhere}</h2>
              <ul>
                {elsewhere.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <p className="site-footer__name" aria-hidden="true">
          JΛCØB
        </p>

        <div className="site-footer__bottom">
          <span>© 2026 JΛCØB</span>
          <span>{t.built}</span>
        </div>
      </div>
    </footer>
  );
}
