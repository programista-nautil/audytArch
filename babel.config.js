module.exports = function (api) {
	api.cache(true)
	return {
		// ========= ZMIANA =========
		presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
		plugins: [
			'@babel/plugin-proposal-export-namespace-from',
			'react-native-reanimated/plugin',
			'react-native-paper/babel',
		],
	}
}
