/**
 * Created by Administrator on 2018/11/16.
 */
const {parseString} = require('xml2js');



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
  }

};
