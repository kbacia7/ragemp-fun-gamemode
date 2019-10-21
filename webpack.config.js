const path = require("path")
const webpack  = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const configServer = {
   mode: 'development',
   target: 'node',
   entry: {
      'packages/FunGamemode/index.js': './src/server/main.ts',
   },
   optimization: {
      minimize: false,
    },
   devtool: 'source-map',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]',
   },
   externals: ['pg-native', 'aws-sdk', 'oracle', 'pg', 'tedious', 'pg-query-stream', 'sqlite3', 'mssql', 'mssql/lib/base', 'mssql/package.json', 'oracledb', 'mysql2'],
   resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [new TsconfigPathsPlugin({
         configFile: "src/tsconfig.json"
      })]
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: [
               /node_modules/,
            ]
         },
         {
            test: /\.less$/,
            use: [
               {
                  loader: 'style-loader', 
               },
               {
                  loader: 'css-loader', 
               },
               {
                  loader: 'less-loader', 
                  options: {
                     plugins: [require('less-plugin-glob')],
                     paths: [
                        path.resolve(path.join(__dirname, "src/client/ui"))
                     ] 
                  }
               },
            ],
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
               'file-loader'
            ]
         }
      ],
   },
   plugins: [
      new CopyPlugin([
         {from: './src/server/migrations', to: './migrations'},
         {from: './src/server/seeds', to: './seeds'}
      ]),
   ]

};

const configClient = {
   mode: 'development',
   entry: {
      'client_packages/index.js': './src/client/main.ts',
      'client_packages/ui/active-players/index.js': './src/client/ui/active-players/main.ts',
      'client_packages/ui/player-register-and-login/index.js': './src/client/ui/player-register-and-login/main.ts',
      'client_packages/ui/notifications/index.js': './src/client/ui/notifications/main.ts',
      'client_packages/ui/actions-menu/index.js': './src/client/ui/actions-menu/main.ts'
   },
   optimization: {
      minimize: false,
    },
   devtool: 'source-map',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]',
   },
   resolve: {
      extensions: [".ts", ".tsx", ".js"],
      plugins: [new TsconfigPathsPlugin({
         configFile: "src/tsconfig.json"
      })]
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: [
               /node_modules/,
            ]
         },
         {
            test: /\.less$/,
            use: [
               {
                  loader: 'style-loader', 
               },
               {
                  loader: 'css-loader', 
               },
               {
                  loader: 'less-loader', 
                  options: {
                     plugins: [require('less-plugin-glob')],
                     paths: [
                        path.resolve(path.join(__dirname, "src/client/ui"))
                     ] 
                  }
               },
            ],
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
               'file-loader'
            ]
         }
      ],
   },
   plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin([
         {from: './src/client/ui', to: './client_packages/ui', ignore: ['*.less', '*.ts']}
      ]),
   ]
};

module.exports = [configServer, configClient]

