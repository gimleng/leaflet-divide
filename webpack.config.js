const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { version } = require("./package.json");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "leaflet-divide.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8000,
                            name: "images/[hash]-[name].[ext]",
                        },
                    },
                ],
            },
        ],
    },
    externals: {
        leaflet: "L",
    },
    devServer: {
        index: "./index.html",
        publicPath: "./src",
        writeToDisk: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "leaflet-divide.css",
        }),
    ],
};
