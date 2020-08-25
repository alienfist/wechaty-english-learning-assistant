"use strict"

const config_file = require('./config_secret.js')              //引入配置文件
const config = config_file.config

const qrcodeTerminal = require('qrcode-terminal')
const request = require('request')
const crypto = require('crypto')
const { Wechaty } = require('wechaty') 
const bot = new Wechaty({profile:'myrobot'})

const fs = require('fs')
const { Config } = require('wechaty/dist/src/config')
const file = config.db_file
const exists = fs.existsSync(file);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(file)

function create_sqlite3_db(){
    //创建sqlite3数据库,已经创建无需使用
    const sqlite3 = require('sqlite3').verbose()
    var db = new sqlite3.Database("data.db", function(err){
        if (err) throw err
        console.log("data.db is created")
    })
}

function randomCaihongId(text_class){
    // 随机一句彩虹屁的id
    // text_class参数为文本类型：2-彩虹屁&情话，3-励志
    return new Promise((resolve, reject) =>{
        db.all(`select id from caihongpi where class=${text_class}`, function(err, data){
            //介于0和数据总长之间的随机数
            const start_num = 0
            var random_num = Math.round(Math.random()*(data.length-start_num) + start_num)
            //获取该index的id值
            var id = data[random_num]["id"]
            // console.log(id)
            resolve(id)
        })
    })
}

function randomSentenceId(){
    // 随机每日一句英语的id
    return new Promise((resolve, reject) =>{
        db.all('select id from sentence', function(err, data){
            //介于0和数据总长之间的随机数
            const start_num = 0
            var random_num = Math.round(Math.random()*(data.length-start_num) + start_num)
            //获取该index的id值
            var id = data[random_num]["id"]
            // console.log(id)
            resolve(id)
        })
    })
}

function getCaihongText(text_class){
    // 通过id获取彩虹屁内容
    return new Promise((resolve, reject) => {
        randomCaihongId(text_class).then(
            value => {
                db.get(`select text from caihongpi where id=${value}`, function(err, data){
                    resolve(data["text"])
                })
            }
        )
    })
}

function getSentenceText(){
    // 通过id获取每日一句英语内容
    return new Promise((resolve, reject) => {
        randomSentenceId().then(
            value => {
                db.get(`select * from sentence where id=${value}`, function(err, data){
                    resolve("今天的每日一句是：\n" + data["en_sentence"] + "\n" + data["cn_sentence"])
                })
            }
        )
    })
}

function onScan (qrcode, status) {
	qrcodeTerminal.generate(qrcode)
    const qrcodeImageUrl = [
      'https://wechaty.js.org.qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
}
  
function onLogin (user) {
  console.log('StarterBot', '%s login', user)
}

function onLogout (user) {
  console.log('StarterBot', '%s logout', user)
}

function queryWordFromBaiduApi (content, lan) {
    //通过百度翻译Api获取翻译结果
    const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
    //此处填入你申请的百度翻译的appid和secretKey
    const appid = config.baidu_appid
    const secretKey = config.baidu_secretKey
    //随机数字,salt随便取,这里设置了666
    const salt = (config.baidu_salt).toString()
    //签名内容字符串=appid+q+salt+密钥
    const sign_content = appid + content + salt + secretKey
    //签名内容字符串MD5加密构成签名
    const sign = crypto.createHash('md5').update(sign_content).digest("hex")

    //默认英文查中文
    var lan_from = 'en'
    var lan_to = 'zh'
    //根据参数lan,切换为中文查英文
    if (lan == 'zh'){
        lan_from = 'zh'
        lan_to = 'en'
    } 

    return new Promise((resolve,reject)=>{
        var requestData={
            'q': content,
            'from': lan_from,
            'to': lan_to,
            'appid': appid,
            'salt': salt,
            'sign': sign
        }
        request({
            url: url,
            method: "GET",
            timeout: 5000,
            json: true,
            headers: {
            "content-type": "application/json",
            },
            qs: requestData
            }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                content = body["trans_result"][0]["dst"]
                resolve(content)
            }
        })
    })
}

async function onMessage (msg) {
    if (msg.self()){
        return
    }
    if (msg.type()!==bot.Message.Type.Text){
        //非文本类型消息不作响应
        console.log(msg.type())
        return
    }

    const content = msg.text()
    const contact = msg.from()
    const room = msg.room()

    // 群内消息回复
    if (room) {        
        console.log(`Message from room: ${await room.topic()}, send content: ${content}, send from: ${contact}`)

        var room_name = await room.topic()
        var Room
        //数组中为需要增加机器人功能的群名
        var room_list = config.room_list

        //在选择群中启动该英语查询功能
        if (room_list.indexOf(room_name) != -1){
            Room = await bot.Room.find({topic: room_name})
            
            //针对翻译功能做一下字数限制
            if (content.length > 200){
                Room.say('查询字符超过200限制', contact)
                return
            }

            //使用句首关键词“？？”作为激活查询标志
            const baidu_keyword = config.keyword_baidu
            if (baidu_keyword.indexOf(content.slice(0,2)) != -1){
                //去掉句首关键词后，获取需要查询的内容
                var query_content = content.slice(2, content.length+1)
                //中英文内容判断：通过escape对字符串编码，字符值大于255的以"%u****"格式存储，英文字符值小于255
                if(escape(query_content).indexOf("%u")<0){
                    //英文查中文
                    await queryWordFromBaiduApi(query_content, 'en').then(
                        value => {
                            Room.say('翻译结果：' + value, contact)
                        }
                    ).catch(
                        console.log
                    )
                }else{
                    //中文查英文
                    await queryWordFromBaiduApi(query_content, 'zh').then(
                        value => {
                            Room.say('翻译结果：' + value, contact)
                        }
                    )
                }
            } 
            //励志名言
            else if (content === config.keyword_lizhi) {
                getCaihongText(3).then(
                    value => {
                        Room.say(value, contact)
                    }
                )
            } 
            //彩虹屁
            else if (content === config.keyword_caihong){
                getCaihongText(2).then(
                    value => {
                        Room.say(value, contact)
                    }
                )
            }
            //英语名言
            else if (content === config.keyword_sentence){
                getSentenceText().then(
                    value => {
                        Room.say(value, contact)
                    }
                )
            }
        }
    } else {
        //非群内消息不作处理
        console.log(`Message is not in Room, Content: ${content}, Contact: ${contact}`)
    }
}

async function onRoomJoin(room, inviteeList, inviter){
    //设定入群的固定欢迎语
    const nameList = inviteeList.map(c => c.name()).join(',')
    const room_name = await room.topic()
    console.log(`Room ${room_name} got new member ${nameList}, invited by ${inviter}`)

    if (room_name === "lalala"){
        const contact1 = await bot.Contact.find({name: nameList})
        await room.say(config.welcome, contact1)
    }
}


bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.on('room-join', onRoomJoin)

bot.start()
