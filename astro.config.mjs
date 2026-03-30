import { defineConfig } from 'astro/config';

const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const isGithub = process.env.GITHUB_ACTIONS === 'true';
const siteFromEnv = process.env.SITE;

const defaultSite = 'https://jordimorosbadenes.github.io/setupandhold';

const site = siteFromEnv || defaultSite;
// En GitHub Pages hay dos modos:
// - Project pages: https://user.github.io/<repo>  -> base = '/<repo>'
// - Dominio propio / user pages: https://dominio.tld -> base = '/'
const isProjectPages = Boolean(isGithub && repo && site.includes('github.io') && site.includes(`/${repo}`));

export default defineConfig({
  site,
  base: isProjectPages ? `/${repo}` : '/',
  integrations: [],
});
