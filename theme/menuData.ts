export type IconName =
  | 'writeups'
  | 'blog'
  | 'ctf'
  | 'research'
  | 'projects'
  | 'about'
  | 'github';

export type MenuItem = {
  title: string;
  description: string;
  icon: IconName;
  // Internal page, relative to the locale root (the English root has no prefix).
  path?: string;
  // External link. Takes precedence over `path`.
  url?: string;
  children?: MenuItem[];
};

export type MenuColumn = {
  heading: string;
  items: MenuItem[];
};

export type MenuLocale = {
  columns: MenuColumn[];
};

export const productMenu: Record<'en' | 'zh', MenuLocale> = {
  en: {
    columns: [
      {
        heading: 'Content',
        items: [
          {
            title: 'Writeups',
            description: 'Step-by-step walkthroughs',
            icon: 'writeups',
            path: '/writeups/',
          },
          {
            title: 'Blog',
            description: 'Notes and opinions',
            icon: 'blog',
            path: '/blog/',
          },
          {
            title: 'CTF',
            description: 'Competitions, teams and results',
            icon: 'ctf',
            path: '/ctf/',
          },
        ],
      },
      {
        heading: 'Work',
        items: [
          {
            title: 'Research',
            description: 'Vulnerabilities I have disclosed',
            icon: 'research',
            path: '/research/',
          },
          {
            title: 'Projects',
            description: 'Tools, scripts and proofs of concept',
            icon: 'projects',
            path: '/projects/',
            children: [
              {
                title: 'GitHub',
                description: 'Code on GitHub',
                icon: 'github',
                url: 'https://github.com/jacob-valor',
              },
            ],
          },
        ],
      },
      {
        heading: 'Profile',
        items: [
          {
            title: 'About',
            description: 'Background, certifications and contact',
            icon: 'about',
            path: '/about/',
          },
        ],
      },
    ],
  },
  zh: {
    columns: [
      {
        heading: '内容',
        items: [
          {
            title: '写作',
            description: '分步演练',
            icon: 'writeups',
            path: '/writeups/',
          },
          {
            title: '博客',
            description: '笔记与观点',
            icon: 'blog',
            path: '/blog/',
          },
          {
            title: 'CTF',
            description: '赛事、队伍与成绩',
            icon: 'ctf',
            path: '/ctf/',
          },
        ],
      },
      {
        heading: '工作',
        items: [
          {
            title: '研究',
            description: '已披露的漏洞',
            icon: 'research',
            path: '/research/',
          },
          {
            title: '项目',
            description: '工具、脚本与概念验证',
            icon: 'projects',
            path: '/projects/',
            children: [
              {
                title: 'GitHub',
                description: '代码仓库',
                icon: 'github',
                url: 'https://github.com/jacob-valor',
              },
            ],
          },
        ],
      },
      {
        heading: '个人',
        items: [
          {
            title: '关于',
            description: '背景、证书与联系方式',
            icon: 'about',
            path: '/about/',
          },
        ],
      },
    ],
  },
};
