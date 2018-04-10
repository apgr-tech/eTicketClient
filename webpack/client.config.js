const webpack = require('webpack');
const config = require('sapper/webpack/config.js');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

const sass = require('node-sass');

module.exports = {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: {
        extensions: ['.js', '.json', '.html']
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        hydratable: true,
                        cascade: false,
                        store: true,
                        hotReload: true,
                        style: ({ content, attributes }) => {
                            if (attributes.type !== "text/scss") return;

                            return new Promise((fulfil, reject) => {
                                sass.render(
                                    {
                                        data: content,
                                        includePaths: ['routes'],
                                        sourceMap: true,
                                        importer: function(url, prev) {
                                            if(url.indexOf('@material') === 0) {
                                                const filePath = url.split('@material')[1];
                                                const nodeModulePath = `./node_modules/@material/${filePath}`;
                                                return { file: require('path').resolve(nodeModulePath) };
                                            }
                                            return { file: url };
                                        },
                                        outFile: "x" // this is necessary, but is ignored
                                    },
                                    (err, result) => {
                                        if (err) {
                                            return reject(err);
                                        }
                                        fulfil({
                                            code: result.css,
                                            map: result.map
                                        });
                                    }
                                );
                            });
                        }
                    }
                }
            }
        ]
    },
    mode,
    plugins: [
        isDev && new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.browser': true,
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
    ].filter(Boolean),
    devtool: isDev && 'inline-source-map'
};
