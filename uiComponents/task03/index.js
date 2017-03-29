// 环境变量
const isProduction = process.env.NODE_ENV === 'production';
/* -------------
 * 核心依赖
 * ------------- */
// 导入 koa 依赖
const Koa = require('koa')
// 创建一个Koa对象表示web app本身:
const app = new Koa()
/* -------------
 * 中间件
 * ------------- */
// 静态文件支持
const serve = require('koa-static')
app.use(serve(__dirname + '/assets'))
// 模板中间件
const templating = require('./middlewares/templating')
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))
/* -------------
 * 配置路由
 * ------------- */
const router = require('koa-router')()
// 请求首页
router.get('/', (ctx, next) => {
    ctx.render('index.html')
})
// 用以解析前端提交的文件
const multer  = require('koa-multer')
// 配置文件保存目录
const upload = multer({ dest: './' })
// 请求 upload 的响应，需要提交的字段为 filename
router.post('/upload', upload.single('filename'), async (ctx, next) => {
    const { originalname, path, mimetype } = ctx.req.file
    let result = `{"result": "error"}`
    if (path) {
        result = `{"result": "success", "path": "${path}"}`
    }
    ctx.body = result
})
app.use(router.routes())
/* -------------
 * 开启服务器
 * ------------- */
// 在端口3000监听
app.listen(3000)
console.log('app started at port 3000...')