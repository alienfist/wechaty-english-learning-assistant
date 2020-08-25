基于wechaty的英语学习群助手
=

安装
-
node版本v12+<br>
>git clone 本项目<br>
>cd wechaty-english-learning-assistant<br>
>sudo npm install //安装<br>

配置环境变量<br>
因为采用wechaty ipad协议，需要修改一个环境变量<br>
>export WECHATY_PUPPET=wechaty-puppet-padplus<br>
>export WECHATY_PUPPET_PADPLUS_TOKEN='这里是你从wechaty申请的token'<br>

按如下修改index.js中引入文件名<br>
>const config_file = require('./config.js')          //引入配置文件<br>
在config.js增加你需要功能支持的微信群名称<br>
>"room_list": ["群名称1", "群名称2"],                 //需要支持的群名称列表<br>
>记得把机器人拉入该群<br>

运行程序<br>
>sudo node index.js<br>

备注：如果sudo运行npm或node时，出现找不到命令的情况，运行下面这些命令<br>
sudo ln -s /usr/local/bin/node /usr/bin/node<br>
sudo ln -s /usr/local/lib/node /usr/lib/node<br>
sudo ln -s /usr/local/bin/npm /usr/bin/npm<br>
sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf<br>

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
