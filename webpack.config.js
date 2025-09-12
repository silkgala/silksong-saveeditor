var path = require("path")
var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: "bundle.js",
        // <<< ADD THIS LINE
        // This tells Webpack that on the production server (GitHub Pages), 
        // all assets are located in the "/silksong-saveeditor/" subfolder.
        publicPath: "/silksong-saveeditor/" 
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: "./docs",
        port: 8080,
        compress: true
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, use: ["style-loader", "css-loader"]} // Changed 'loader' to 'use' for consistency, though both work
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    mode: "development",
    target: "web"
}
