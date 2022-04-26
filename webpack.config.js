const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry:{
        main:"./src/client/js/main.js",
        videoPlayer:"./src/client/js/videoPlayer.js",
        recorder:"./src/client/js/recorder.js"},
    mode:"development",
    watch:true,
    plugins: [new MiniCssExtractPlugin({
        filename:"css/styles.css"
    })],
    output:{
        filename:"js/[name].js",
        //파일까지의 전체 경로가 필요함
        //dirname은 그 전체 경로를 제공해 줌(wetube까지). 세부 폴더(/assets/js)를 뒤에 나열해주면 됨. 
        path: path.resolve(__dirname,"assets"),
        //clean은 필요하지 않은 파일을 없애준다던지,, 뭐 그럼,,
        clean:true,
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                use:{
                    loader:"babel-loader",
                    options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                }
            },
            {
                test:/\.scss$/,
                //loader는 loader를 적은 순서의 역순으로 읽혀짐 (=역순으로 작성해야 함)
                use:[MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    }
}