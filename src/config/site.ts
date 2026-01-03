import { withBase } from '../utils/withBase';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/jordimorosbadenes/';
export const GITHUB_PROFILE_URL = 'https://github.com/jordimorosbadenes';
export const REPOSITORY_URL = 'https://github.com/jordimorosbadenes/setupandhold';

export const DEFAULT_CONTACT_EMAIL = 'jordimorosbadenes@gmail.com';
const contactEmailFromEnv = import.meta.env.PUBLIC_CONTACT_EMAIL;
export const CONTACT_EMAIL = contactEmailFromEnv && contactEmailFromEnv.trim()
	? contactEmailFromEnv
	: DEFAULT_CONTACT_EMAIL;
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const DEFAULT_AVATAR_URL = withBase('/img/jordi.jpg');
const avatarFromEnv = import.meta.env.PUBLIC_PROFILE_PHOTO_URL;
export const AVATAR_URL = avatarFromEnv && avatarFromEnv.trim() ? avatarFromEnv : DEFAULT_AVATAR_URL;

export const DEFAULT_PUZZLEGEN_URL = 'https://puzzle-generator-vkgt.onrender.com';
const puzzlegenFromEnv = import.meta.env.PUBLIC_PUZZLEGEN_URL;
export const PUZZLEGEN_URL = puzzlegenFromEnv && puzzlegenFromEnv.trim()
	? puzzlegenFromEnv
	: DEFAULT_PUZZLEGEN_URL;
