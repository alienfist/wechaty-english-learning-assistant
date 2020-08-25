基于wechaty的英语学习群助手
=

安装
-
node版本v12+<br>
git clone 本项目<br>
cd wechaty-english-learning-assistant<br>
npm install //安装<br>

数据存储采用sqlite3数据库(data.db)，包括两张表<br>
>caihongpi：包含中文彩虹屁情话数据和中文励志数据，总共2783条<br>
>sentence：包含中英文（名人名言，励志名言，鸡汤），总共6137条<br>

功能
-
1.调用百度翻译api<br>
>百度翻译开放平台申请https://api.fanyi.baidu.com/<br>
>在config.js中配置<br>
>>"baidu_appid": '8888888888888888',                 //百度翻译api的appid<br>
>>"baidu_secretKey": 'aaaaaaaaaaaaaaaaaaa',          //百度翻译api的key<br>

2.关键词激发相关功能<br>
>在config.js配置相关关键词<br>
>>"keyword_baidu": ["??","？？"],                     // 激发百度翻译功能的句首关键词,仅支持两个字符<br>
>>"keyword_caihong": "夸我",                          // 彩虹屁关键词设定<br>
>>"keyword_lizhi": "加油",                            // 中文励志关键词设定<br>
>>"keyword_sentence": "每日一句",                      // 英文名言关键词设定<br>
