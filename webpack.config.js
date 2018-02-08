require('dotenv').config();

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'src/js/client'),
    output: {
        path: path.join(__dirname, 'src/js'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'env', 'stage-0']
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV:   JSON.stringify(process.env.NODE_ENV),
                PORT:       JSON.stringify(process.env.PORT),
                BAR_KEY:    JSON.stringify(process.env.BAR_KEY),
                APP_URL:    JSON.stringify(process.env.APP_URL),
                MONGO_URI:  JSON.stringify(process.env.MONGO_URI)
            }
        })
    ]
};