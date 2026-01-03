import { withBase } from '../utils/withBase';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/jordimorosbadenes/';
export const GITHUB_PROFILE_URL = 'https://github.com/jordimorosbadenes';
export const REPOSITORY_URL = 'https://github.com/jordimorosbadenes/setupandhold';

export const DEFAULT_CONTACT_EMAIL = 'jordimorosbadenes@gmail.com';
export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL ?? DEFAULT_CONTACT_EMAIL;
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const DEFAULT_AVATAR_URL = withBase('/img/jordi.jpg');
export const AVATAR_URL = import.meta.env.PUBLIC_PROFILE_PHOTO_URL || DEFAULT_AVATAR_URL;

export const DEFAULT_PUZZLEGEN_URL = 'https://puzzle-generator-vkgt.onrender.com';
export const PUZZLEGEN_URL = import.meta.env.PUBLIC_PUZZLEGEN_URL ?? DEFAULT_PUZZLEGEN_URL;
