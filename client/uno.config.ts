import { defineConfig, presetWind } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  	presets: [
		presetWind(),
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
