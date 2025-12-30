import { defineConfig } from 'astro/config';

const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const isGithub = process.env.GITHUB_ACTIONS === 'true';
const siteFromEnv = process.env.SITE;

const defaultSite = 'https://jordimorosbadenes.github.io/setupandhold';

export default defineConfig({
  site: siteFromEnv || defaultSite,
  base: isGithub && repo ? `/${repo}` : '/',
  integrations: [],
});
