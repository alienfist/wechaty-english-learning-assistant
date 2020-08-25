//相关配置信息
//baidu_appid,baidu_secretKey,room_list必须配置成自己的才可正常使用
const config = {
    "baidu_appid": '8888888888888888',                 //百度翻译api的appid
    "baidu_secretKey": 'aaaaaaaaaaaaaaaaaaa',          //百度翻译api的key
    "room_list": ["群名称1", "群名称2"],                 //需要支持的群名称列表（记得把机器人拉入该群）

    "db_file": 'data.db',                              //sqlite3数据库文件路径
    "baidu_salt": 666,                                 //百度翻译salt，这个值随便设置
    "keyword_baidu": ["??","？？"],                     // 激发百度翻译功能的句首关键词,仅支持两个字符
    "keyword_caihong": "夸我",                          // 彩虹屁关键词设定
    "keyword_lizhi": "加油",                            // 中文励志关键词设定
    "keyword_sentence": "每日一句",                      // 英文名言关键词设定
    // 加群欢迎语设定
    "welcome": "欢迎加入本群\n\
    本群具备以下功能:\n\
    1.文本翻译,请发送“??内容”\n\
    2.每日英语,请发送“每日一句”\n\
    3.鼓励自己,请发送“加油”\n\
    4.想听夸赞,请发送“夸我”\n\
    请不要在群内发广告，谢谢"
}

module.exports.config = config
