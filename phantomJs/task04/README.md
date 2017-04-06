# 网页抓取分析

将项目`clone`下来后，首先使用`docker`开启`mongodb`容器

```bash
docker run -v "$(pwd)":/data --name phantom_db -p 27017:27017 -d mongo
```

开启成功后安装项目依赖：

```bash
npm i
```

然后就可以运行服务了。