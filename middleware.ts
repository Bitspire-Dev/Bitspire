export { default } from './src/proxy';
export const config = {
	matcher: [
		'/((?!_next|_vercel|api|favicon.ico|.*\\.[^/]+$).*)',
	],
};
