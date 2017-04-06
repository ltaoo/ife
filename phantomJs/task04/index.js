// 环境变量
const isProduction = process.env.NODE_ENV === 'production';
// -------------
// 核心依赖
// -------------
// 导入 koa 依赖
const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// -------------
// 中间件
// -------------
// 静态文件支持
const serve = require('koa-static')
app.use(serve(__dirname + '/assets'));
// 模板中间件
const templating = require('./middlewares/templating')
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
// 控制器中间件
const controller = require('./middlewares/controller');
// 注册配置好的路由
app.use(controller());
// -------------
// 开启服务器
// -------------
// 在端口3000监听:
app.listen(8082);
console.log('app started at port 8082...');