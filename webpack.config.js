module.exports = {
    // This is the "main" file which should include all other modules
    entry: '/Users/rafiq/Sites/cracker-clicker/src/main.js',
    // Where should the compiled file go?
    output: {
        // To the `dist` folder
        path: '/Users/rafiq/Sites/cracker-clicker/dist',
        // With the filename `build.js` so it's dist/build.js
        filename: 'build.js'
    },
    module: {
        // Special compilation rules
        loaders: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.js$/,
                // Transform it with babel
                loader: 'babel-loader',
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};
