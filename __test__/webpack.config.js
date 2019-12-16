const { resolve } = require('path')
const Copy = require('copy-webpack-plugin')
const BackgroundLogger = require('../src/main')
const ChromeLauncher = require('webpack-chrome-extension-launcher')

const src = (path = '') => resolve(__dirname, 'src', path)
const dist = resolve(__dirname, 'dist')

/** @return {import('webpack').Configuration} */
module.exports = (env, argv) => {
	const isProd = Boolean(env != null && (env === 'prod' || env.hasOwnProperty('prod')))
	const isDev = !isProd

	return {
		entry: {
			background: src('background.js'),
			'content-script': src('content-script.js'),
			popup: src('popup.js'),
			options: src('options.js'),
		},
		output: {
			filename: '[name].js',
			path: dist,
		},
		resolve: { extensions: ['.js'] },
		mode: isProd ? 'production' : 'development',
		devtool: isDev ? 'inline-source-map' : false,
		plugins: [
			new BackgroundLogger({ revertToLog: isProd }),
			new ChromeLauncher(),
			// @ts-ignore
			new Copy([src('options.html'), src('popup.html'), src('manifest.json')]),
		],
	}
}
