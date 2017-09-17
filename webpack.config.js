module.exports = {
    entry: "./game/index.js",
    output: {
        path: __dirname,
        filename: "dist/index.js"
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['env', 'react']
                }
              }
            },
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    }
};
