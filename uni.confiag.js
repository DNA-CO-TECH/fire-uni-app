module.exports = {
	// ... other configurations
	devServer: {
		proxy: {
			'/app': {
				target: 'https://aiyin.xyz:3005',
				changeOrigin: true,
				pathRewrite: {
					'^/app': '/app'
				}
			}
		}
	}
}