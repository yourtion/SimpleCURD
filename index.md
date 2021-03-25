## SimpleCURD

SimpleCURD 是一个简化后端开发，通过管理界面添加相应的数据表即可自动生成前端提交数据的API，以及后台查看管理数据界面的管理工具。

系统使用 ERest 开发，有完善测试代码（[test/api](https://github.com/yourtion/SimpleCURD/tree/master/server/test/api)）与自动生成的文档 [wiki](https://github.com/yourtion/SimpleCURD/wiki/)

## 功能特性

将已存在的数据表在后台添加到系统中，无需任何开发部署，即可获得：

1. 为运营相关人员提供查看下载数据的列表与编辑页面（编辑功能按照数据表字段自动生成）
2. 为前端提供操作表数据的 CURD API 接口（[wiki/collect](https://github.com/yourtion/SimpleCURD/wiki/collect)）
3. 为前端直接提供SDK（[wiki/sdk](https://github.com/yourtion/SimpleCURD/wiki/SimpleCURD-SDK)）
4. 为不同项目提供不同数据的权限管控（查看、可编辑）
## 安装部署

### 开发

```bash
$ cd admin-web && npm run dev
$ cd server && npm run dev
```
### 部署

新建数据库并建立表结构（在 `setup` 目录中的 `sql` 文件）

部署服务端，上传 `server` 文件夹到服务器上（已安装 Node.js 和 pm2），执行：

```bash
$ npm run deploy
```

构建前端 构建后上传到 `server` 所在位置的 `static` 文件夹中的 `admin` 目录（也可以使用其他静态文件服务器）

```bash
$ cd admin-web && npm install && npm run build
$ npm run deploy
```

默认用户名密码：admin / 123456
