# 文件上传项目-后台文件

- [项目架构分析](#项目架构分析)
- [项目目录及内容分析](#项目目录及内容分析)
- [nginx 服务器配置](#nginx-服务器配置)
- [使用 pm2 启动后台](#使用-pm2-启动后台)

## 项目架构分析

> 使用 nodejs express 框架 + multer(解析上传文件)中间件 & unzip(解压压缩包) & cheerio + mysql 数据库 + nginx 服务器 + pm2 托管项目

## 项目目录及内容分析

> `bin`

放置 node 项目启动文件 'www'

> `config`

- `files.config`

  放置文件上传所需的配置:

  | key             | description            |
  | --------------- | ---------------------- |
  | 'recordPath'    | 服务器存放上传文件地址 |
  | 'onlinePath'    | 服务器文件线上访问地址 |
  | 'appendContent' | axure 文件转化所需方法 |

- `mysql.config`

  读写数据库配置:

  | key                  | description           |
  | -------------------- | --------------------- |
  | 'host'               | 数据库地址            |
  | 'user'               | 访问数据库账户        |
  | 'password'           | 账户密码              |
  | 'database'           | 数据库名称            |
  | 'multipleStatements' | 一次执行多条 sql 配置 |
  | 'timezone'           | 匹配数据库时间        |

> `Controllers`

- `getList`

  从数据库获取页面所需字段

  | key        | description      |
  | ---------- | ---------------- |
  | name       | 项目名称         |
  | submitter  | 提交人           |
  | updateTime | 提交日期         |
  | planTime   | 计划上线日期     |
  | remark     | 项目备注         |
  | url        | 项目线上访问地址 |

- `upload`

  将上传文件信息整合插入数据库

  ```
  1.将上传文件(压缩包)转入服务器对应目录中
  2.解压文件
  3.判断文件是否为axure文件(根据文件夹下一层级是否含有index.html文件判断)
  4.使用cheerio读取index.html,并将转化axure项目的方法字符串插入
  5.记录文件所在的服务器地址,生成可访问的线上地址
  6.将两条地址信息和上传文件时携带的其他信息(项目名称等),一并插入数据库中
  ```

- `delete`

  从数据库删除项目记录,和删除服务器的项目文件

> `MiddleWare`

- `upload`

  该文件为 multer 中间件的配置

  使用 multer.diskStorage

  | key         | description                                    |
  | ----------- | ---------------------------------------------- |
  | destination | 上传文件默认放置的文件夹位置                   |
  | filename    | 将 file 参数里的 originalname,重新给压缩包命名 |

  具体参照: [multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)

> `Models`

存放 Controllers 文件的 Sql 命令的执行文件

> `node_modules`

下载的项目依赖包

> `public`

存放静态文件(express 项目生成自带)

> `routes`

接口路由管理

| routes        | method | description                                           |
| ------------- | ------ | ----------------------------------------------------- |
| /postFiles    | POST   | 上传文件的接口,参数参考/Controller/getlist            |
| /getFilesList | GET    | 获取所有文件信息接口,页面初始化和刷新时使用,无参数    |
| /deleteFiles  | DELETE | 删除文件接口,参数 name: String 项目名称(项目名称唯一) |

> `utils`

存放通用方法

| file  | description                                                |
| ----- | ---------------------------------------------------------- |
| SqlFn | 封装 mysql 的通用执行方法                                  |
| util  | 上传文件去除后缀、修改项目线上地址、遍历删除服务器文件方法 |

## nginx 服务器配置

```nginx
  http{
    server {
      listen  80; // 访问端口
      server_name localhost; //默认为localhost,更改为内网ip可能要修改host文件

      location / {  // 服务器ip的根路径
        root E:/website;  // 项目存放的路径
        index index.html index.htm index.php; // 访问时的默认文件
      }
    }
  }
```

## 使用 pm2 启动后台

安装 pm2

`npm install pm2 -g`

进入项目目录后 启动项目

`pm2 start ./bin/www`

停止项目

`pm2 stop ./bin/www`

查看 pm2 管理项目的日志

`pm2 logs`

更多命令参考: [pm2 基本命令](https://blog.csdn.net/chengxuyuanyonghu/article/details/74910875)
