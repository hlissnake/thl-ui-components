var path = require('path');

module.exports = {
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /.js(x|)?$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, '../node_modules/rebass'),
					path.resolve(__dirname, '../GeneratedForm'),
					path.resolve(__dirname, '../NavigationToolbar'),
					path.resolve(__dirname, '../RebassThemes'),
					path.resolve(__dirname, '../Stateless'),
					path.resolve(__dirname, '../ToolbarOverflow'),
					path.resolve(__dirname, '../VersionedComponent'),
					path.resolve(__dirname, '../AuthPinModal'),
					path.resolve(__dirname, '../SearchSelect'),
					path.resolve(__dirname, '../ProgressBar'),
					path.resolve(__dirname, '../DateSelector'),
					path.resolve(__dirname, '../TimeSelector')
				],
				query: {
					presets: ['es2015', 'react', 'stage-0']
				}
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			{
				test: /\.json$/,
				loaders: ['json']
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css']
			}
		]
	}
};
    
