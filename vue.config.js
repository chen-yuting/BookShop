// function mock(app,url,data){
//     app.get(url,(request,response)=>{
//         response.json(data)
//     })
// }

// const homeData = require('./src/mock/bookHome')
// const bookShelf = require('./src/mock/bookShelf')
// const bookList = require('./src/mock/bookList')
// const bookFlatList = require('./src/mock/bookFlatList')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    devServer:{
        // before(app){
        //     mock(app,'/book/home',homeData)
        //     mock(app,'/book/shelf',bookShelf)
        //     mock(app,'/book/list',bookList)
        //     mock(app,'/book/flat-list',bookFlatList)
        // }
    },
    configureWebpack: {
        performance: {
          hints: 'warning',
          maxAssetSize: 524228 * 10,
          maxEntrypointSize: 524288 * 10
        }
    },
}