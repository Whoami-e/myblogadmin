module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://192.168.0.15:8081',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://192.168.0.15:8081',
                changeOrigin: true
            }
        }
    }
};