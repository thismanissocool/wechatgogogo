/**
 * Created by Administrator on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');

const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('./utils/tools');
const template = require('./reply/template');

const app = express();
/*
 1. 搭建开发者服务器, 使用中间件接受请求
 2. 默认localhost:3000访问本地服务器， 需要一个互联网能够访问的域名地址
 借助ngrok工具，能将本地地址映射为互联网能访问的域名地址
 3. 测试号管理页面填写服务器配置：
 url：通过ngrok映射的地址   http://3389687c.ngrok.io
 token：参与微信签名加密的参数， 自己定义，尽量复杂
 4. 验证微信服务器有效性
 目的：验证消息来自于微信服务器， 同时返回一个特定参数给微信服务器（告诉微信服务器我这里准备ok）

 - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
 - 将排序后的参数拼接在一起，进行sha1加密
 - 加密后的到的就是微信签名，将其与微信发送过来的微信签名对比，
 - 如果一样，说明消息来自于微信服务器，返回echostr给微信服务器
 - 如果不一样，说明消息不是微信服务器发送过来的，返回error

 { signature: 'bcf0001cd20dd9dd9185c29395cfd2666268d495',
 echostr: '6894586667406900661',
 timestamp: '1542366385',
 nonce: '909429753' }
 */

const configg = {
  appID: 'wx0310981b5f1b2b24',
  appsecret: 'b2413b8a96507969709e61c80cd173c0',
  token: 'atguiguTest520'
};

//与微信服务器通信
app.use(async (req,res,next) => {
  // console.log(req.query);
  //解析出微信服务器发送的请求信息
  const {signature, echostr, timestamp, nonce} = req.query;

  // 验证微信服务器有效性
  // 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序(sort)排序
  const {token} = configg;

  const arr = [timestamp, nonce, token].sort();

  const str = sha1(arr.join( ''));

  /*
   微信服务器会发送两种类型的消息给开发者
   1. GET 验证服务器有效性逻辑
   2. POST 转发用户消息
   */

  if (req.method === 'GET'){
    if (signature === str) {
      //说明消息来自于微信服务器
      res.end(echostr);
    } else {
      //说明消息不来自于微信服务器
      res.end('error');
    }
  }else if (req.method === 'POST'){
    // 转发用户消息
    //接受微信服务器转发用户消息
    //验证消息来自于微信服务器
    if (signature !== str) {
      res.end('error');
      return;
    }

    //用户发送的消息在请求体,需要解析出微信发送的请求体信息(xml数据形式)
    const xmlData = await getUserDataAsync(req);
    // console.log(xmlData);

    //将用户发送过来的xml数据转化为json数据
    const jsData = await parseXMLDataAsync(xmlData);
    // console.log(jsData);

    //数据格式化
    const message = formatMessage(jsData);

    //配置数据对象
    let options = {
      toUserName: message.FromUserName,
      fromUserName: message.ToUserName,
      createTime: Date.now(),
      msgType: 'text'
    };


    let content = '你好啊！勇士~~~';

    if (message.Content === '1'){
      content = '小芳最帅？';
    }else if (message.Content === '2'){
      content = '帅不过我东哥！';
    }else if (message.Content === '3'){
      content = '我伟哥帅爆炸！！！';
    }else if (message.Content === '4') {
      //回复图文消息
      options.msgType = 'news';
      options.title = '微信公众号开发~';
      options.description = 'class0810~';
      options.picUrl = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
      options.url = 'http://www.atguigu.com';
    }

    // let replyMessage = `<xml>
    //   <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
    //   <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
    //   <CreateTime>${Date.now()}</CreateTime>
    //   <MsgType><![CDATA[text]]></MsgType>
    //   <Content><![CDATA[${content}]]></Content>
    //   </xml>`;

    options.content = content;

    const replyMessage = template(options);

    console.log(replyMessage);
    res.send(replyMessage);
  }else {
    res.end('error');
  }

});

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功');
  else console.log(err);
});