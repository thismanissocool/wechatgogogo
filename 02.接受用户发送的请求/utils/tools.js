/**
 * Created by Administrator on 2018/11/16.
 */
const {parseString} = require('xml2js');
const {writeFile, readFile} = require('fs');



module.exports = {
  //解析post请求体中的信息
  getUserDataAsync(req){
    return new Promise(resolve => {
      let result = '';
      req
        .on('data', data => {
          // console.log(data.toString());
          result += data.toString();
        })
        .on('end', () => {
          console.log('用户数据接受完毕');
          resolve(result);
        })
    })
  },
  //把xml数据转化成json数据
  parseXMLDataAsync(xmlData){
    return new Promise((resolve,reject) => {
      parseString(xmlData,{trim: true},(err, data) => {
        if (!err){
          resolve(data);
        }else{
          reject('parseXMLDataAsync出了问题' + err);
        }
      })
    })
  },
  //格式化数据
  formatMessage({xml}){
    let result = {};
    for (let key in xml){
      let value = xml[key];
      result[key] = value[0];
    }
    return result;
  },
  //保存数据(access_token  ticket)
  writeFileAsync(filePath, data){
    return new Promise((resolve, reject) => {
      //js对象没办法存储，会默认调用toString() --->  [object Object]
      //将js对象转化为json字符串
      writeFile(filePath, JSON.stringify(data), err => {
        if (!err) {
          resolve();
        } else {
          reject('writeFileAsync方法出了问题：' + err);
        }
      })
    })
  },
  //读取数据
  readFileAsync(filePath){
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        //读取的data数据  二进制数据，buffer
        if (!err) {
          //先调用toString转化为json字符串
          //在调用JSON.parse将json字符串解析为js对象
          resolve(JSON.parse(data.toString()));
        } else {
          reject('readAccessToken方法出了问题:' + err);
        }
      })
    })
  }

};
