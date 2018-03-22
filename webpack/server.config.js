const config = require('sapper/webpack/config.js');
const pkg = require('../package.json');

const sass = require('node-sass');

module.exports = {
	entry: config.server.entry(),
	output: config.server.output(),
	target: 'node',
	resolve: {
		extensions: ['.js', '.json', '.html']
	},
	externals: Object.keys(pkg.dependencies),
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: false,
						cascade: false,
						store: true,
						generate: 'ssr',
                        style: ({ content, attributes }) => {
                            if (attributes.type !== "text/scss") return;

                            return new Promise((fulfil, reject) => {
                                sass.render(
                                    {
                                        data: content,
                                        includePaths: [],
                                        sourceMap: false,
                                        outFile: "x" // this is necessary, but is ignored
                                    },
                                    (err, result) => {
                                        if (err) return reject(err);

                                        fulfil({
                                            code: result.css.toString(),
                                            map: ''
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
	mode: process.env.NODE_ENV,
	performance: {
		hints: false // it doesn't matter if server.js is large
	}
};