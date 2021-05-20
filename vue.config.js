module.exports = {
    devServer: {
        port: 8081,
        proxy: {
            '/user': {
                target: 'http://192.168.26.192:8080',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://192.168.26.192:8080',
                changeOrigin: true
            },
            '/log': {
                target: 'http://192.168.26.192:8080',
                changeOrigin: true
            }
        }
    },
    chainWebpack: config => {
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            })
    }
};