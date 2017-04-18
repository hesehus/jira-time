const express = require('express');
const proxy = require('http-proxy-middleware');
const debug = require('debug')('app:server');
const webpack = require('webpack');

const webpackConfig = require('../build/webpack.config');
const config = require('../config');
const dummyApi = require('./jira-dummy-api');
const startWebsocketServer = require('./ws-server');

const app = express();
const paths = config.utils_paths;

startWebsocketServer(app);

if (config.useDummyApi) {
    app.use('/rest', dummyApi);
} else {
    const proxyServer = proxy({
        // ssl: true,
        target: 'http://jira.hesehus.dk',
        changeOrigin: false
    });

    app.use('/rest', proxyServer);
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.
    app.use(require('connect-history-api-fallback')());

    const compiler = webpack(webpackConfig);

    debug('Enable webpack dev and HMR middleware');
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath  : webpackConfig.output.publicPath,
        contentBase : paths.client(),
        hot         : true,
        quiet       : config.compiler_quiet,
        noInfo      : config.compiler_quiet,
        lazy        : false,
        stats       : config.compiler_stats
    }));
    app.use(require('webpack-hot-middleware')(compiler));

    // Serve static assets from ~/src/static since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(paths.client('static')));
} else {
    app.use('/', express.static(paths.dist()));
}

module.exports = app;
