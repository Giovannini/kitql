import watchAndRun from '@kitql/vite-plugin-watch-and-run';
import adapter from '@sveltejs/adapter-auto';
import { dirname, resolve } from 'path';
import preprocess from 'svelte-preprocess';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [ preprocess({ postcss: true }) ],
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$lib: resolve(__dirname, './src/lib'),
					$graphql: resolve(__dirname, './src/lib/graphql'),
					$modules: resolve(__dirname, './src/lib/modules'),
					$kitFeedback: resolve(__dirname, '../../kit-modules/kitFeedback/dist')
				}
			},
			server: {
				fs: {
					allow: [ '..' ],
				},
			},
			optimizeDeps: {
				include: [ 'dataloader' ]
			},
			plugins: [ watchAndRun([ { watch: '**/*.(gql|graphql)', run: 'yarn gen' } ]) ]
		},
		package: {
			dir: 'dist',
			emitTypes: true,
			exports: (filepath) => filepath.endsWith('index.ts'),
			files: (filepath) => !filepath.endsWith('.test.ts')
		}
	}
};

export default config;
