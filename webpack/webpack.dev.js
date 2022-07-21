const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	mode: 'development',
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: './manifest-dev.json',
					to: '../manifest.json',
					context: 'public',
					force: true,
				},
			],
			options: {},
		}),
	],
});
