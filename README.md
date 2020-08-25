# wechaty-english-learning-assistant
基于wechaty的英语学习群助手

node版本v12
git clone本项目
npm install //安装

数据存储采用sqlite3数据库(data.db)，包括两张表
caihongpi：包含中文彩虹屁情话数据和中文励志数据，总共2783条
sentence：包含中英文（名人名言，励志名言，鸡汤），总共6137条

功能
1.调用百度翻译api
百度翻译开放平台申请https://api.fanyi.baidu.com/
在config.js中配置
"baidu_appid": '8888888888888888',                 //百度翻译api的appid
"baidu_secretKey": 'aaaaaaaaaaaaaaaaaaa',          //百度翻译api的key

2.关键词激发相关功能
在config.js配置相关关键词
"keyword_baidu": ["??","？？"],                     // 激发百度翻译功能的句首关键词,仅支持两个字符
"keyword_caihong": "夸我",                          // 彩虹屁关键词设定
"keyword_lizhi": "加油",                            // 中文励志关键词设定
"keyword_sentence": "每日一句",                      // 英文名言关键词设定
