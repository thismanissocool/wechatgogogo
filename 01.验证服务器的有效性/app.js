/**
 * Created by Administrator on 2018/11/16.
 */
const express = require('express');
const app = express();
const sha1 = require('sha1')
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

 { signature: '7b670a2240bd487178bd4e2258100e9c1d315f2d',
 echostr: '6918465573110087483',
 timestamp: '1542353163',
 nonce: '1057503018' }
 */

const configg = {
  appID: 'wx0310981b5f1b2b24',
  appsecret: 'b2413b8a96507969709e61c80cd173c0',
  token: 'atguiguTest20181116'
};

app.use((req,res,next) => {
  console.log(req.query);
  const {signature, echostr, timestamp, nonce} = req.query;
  const {token} = configg;

  const arr = [timestamp, nonce, token].sort();

  const str = sha1(arr.join(''));

  if (signature === str) {
    //说明消息来自于微信服务器
    res.end(echostr);
  } else {
    //说明消息不来自于微信服务器
    res.end('error');
  }

});

app.listen(3000, err => {
  if (!err) console.log('服务器启动成功');
  else console.log(err);
});