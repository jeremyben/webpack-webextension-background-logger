const { resolve } = require('path')
const webpack = require('webpack')
const InjectPlugin = require('webpack-inject-plugin').default

class WebextensionBackgroundLogger {
	/** @param {{backgroundEntry?: string, revertToLog?: boolean}} options */
	constructor(options = {}) {
		this.options = options
	}

	/** @param {webpack.Compiler} compiler */
	apply(compiler) {
		if (this.options.revertToLog === true) {
			// Simply replace console.bg with console.log and stop there
			compiler.options.module.rules.push(this.consoleBgReplaceRule('console.log('))
			return
		}

		const plugins = [
			// Patch console object with bg method
			new webpack.ProvidePlugin({
				'console.bg': [resolve(__dirname, 'console-bg.js'), 'consoleBg'],
			}),
			// Inject message listener in background chunk
			new InjectPlugin(
				() => `
				;(window.chrome || window.browser).runtime.onMessage.addListener((message) => {
					if (message == null || message.constructor !== Object || !message.__console_bg__) return

					const [filename, ...logs] = message.__console_bg__
					console.group(filename)
					console.log(...logs)
					console.groupEnd()
				})
				`,
				{ entryName: this.options.backgroundEntry || 'background' }
			),
		]

		plugins.forEach((plugin) => plugin.apply(compiler))

		// Add filename to identify source of console.bg
		compiler.options.module.rules.push(this.consoleBgReplaceRule('console.bg(__filename,'))

		// Allow the use of _filename
		if (compiler.options.node) {
			compiler.options.node.__filename = true
		} else {
			compiler.options.node = { __filename: true }
		}
	}

	/**
	 * @param {string} replace
	 * @return {webpack.RuleSetRule}
	 */
	consoleBgReplaceRule(replace) {
		return {
			test: /\.(t|j)sx?$/,
			loader: require.resolve('string-replace-loader'),
			options: {
				search: 'console.bg\\(',
				replace,
				flags: 'g',
			},
		}
	}
}

exports = module.exports = WebextensionBackgroundLogger
