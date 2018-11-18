/**
 * Created by Administrator on 2018/11/18.
 */

 module.exports = message => {
   let options = {
     toUserName: message.FromUserName,
     fromUserName: message.ToUserName,
     createTime: Date.now(),
     msgType: 'text'
   };
   console.log(message);

   // { ToUserName: 'gh_00434ee0141d',
   //   FromUserName: 'oTaDw0vGVT2bOduRvtFO9dbzSnS8',
   //   CreateTime: '1542551624',
   //   MsgType: 'text',
   //   Content: '1',
   //   MsgId: '6625208777888669544' }

   let content = '无法识别，输入数字有惊喜！！！';

   if (message.MsgType === 'text') {
     if (message.Content === '1') {  //全匹配
       content = '德玛西亚，永不认输';
     } else if (message.Content === '2') {
       content = '诺克萨斯，血战到底';
     } else if (message.Content.includes('小老弟')) {
       content = '尽瞎想~~~，小老弟洗洗睡吧！';
     } else if (message.Content === '3') {
       //回复图文消息
       options.msgType = 'news';
       options.title = '微信公众号开发~';
       options.description = 'class0810~';
       options.picUrl = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
       options.url = 'http://www.atguigu.com';
     }
   }else if (message.MsgType === 'voice'){
     content = `语音识别结果为: ${message.Recognition}`;
   }else if (message.MsgType === 'location'){
     content = `纬度：${message.Location_X}  经度：${message.Location_Y} 地图的缩放大小：${message.Scale} 位置详情：${message.Label}`;
   }else if (message.MsgType === 'event'){
     if (message.Event === 'subscribe'){
       content = '欢迎您关注公众号~';
       if (message.EventKey) {
         //说明扫了带参数的二维码
         content = '欢迎您关注公众号~, 扫了带参数的二维码';
       }
     }else if (message.Event === 'unsubscribe') {
       //取消关注事件
       console.log('用户丢失！');
     } else if (message.Event === 'LOCATION') {
       //用户初次访问公众号，会自动获取地理位置
       content = `纬度：${message.Latitude} 经度：${message.Longitude}`;
     } else if (message.Event === 'CLICK') {
       //用户初次访问公众号，会自动获取地理位置
       content = `用户点击了：${message.EventKey}`;
     }
   }

   options.content = content;

   return options;
 };