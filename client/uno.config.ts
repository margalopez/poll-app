import { defineConfig, presetWind, presetIcons } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  	presets: [
		presetWind(),
		presetIcons({
			collections: {
				poll: FileSystemIconLoader(
					'./src/assets/icons',
					svg => svg.replace(/#fff/, 'currentColor')
				),
			}
		})
	],
	transformers: [
		transformerDirectives(),
	],
	theme: {
		colors: {},
		fontFamily: {
            sans: ['MozillaText', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            serif: ['Arvo', 'ui-serif', 'Georgia', 'serif'],
        }
	}
})
