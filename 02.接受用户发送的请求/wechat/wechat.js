/**
 * Created by Administrator on 2018/11/17.
 */
const rp = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID, appsecret} = require('../configg');


class Wechat {
  /**
   * 获取access_token
   * @return {Promise<result>}
   */
 async getAccessToken () {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    const result = await rp({method: 'GET', url, json: true});
    result.expries_in = Date.now() + (2*60 - 5)*60*1000;
    return result;
  };

  /**
   * 保存access_token
   * @param filePath  要保存的文件路径
   * @param accessToken  要保存的凭据
   * @return {Promise<any>}
   */
 saveAccessToken (filePath, accessToken) {
  return new Promise((resolve, reject) => {
    writeFile(filePath, JSON.stringify(accessToken), err => {
      if (!err) {
          resolve();
      } else {
          reject('saveAccessToken方法出了问题：' + err);
      }
    });
  });
 };
  /**
   * 读取access_token
   * @param filePath 文件路径
   * @return {Promise<any>}
   */
  readAccessToken (filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (!err) {
          //先调用toString转化为json字符串
          //在调用JSON.parse将json字符串解析为js对象
          resolve(JSON.parse(data.toString()));
        }else {
          reject('readAccessToken方法出了问题:' + err);
        }
      });
    });
  };

  /**
   * 判断access_token是否过期
   * @param accessToken
   * @return {boolean}
   */
  isValidAccessToken ({expires_in}) {
    if (Date.now() >= expires_in){
      return false;
    } else {
      return true;
    }
  };
  /**
   * 返回有效access_token的方法
   * @return {Promise<accessToken>}
   */
  fetchAccessToken () {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      //说明access_token是有效的
      return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in});
    }

    //最终目的返回有效access_token
    return this.readAccessToken('./accessToken.txt')
      .then(async res => {
        if (this.isValidAccessToken(res)) {
          //没有过期，直接使用
          //作为then函数返回值， promise对象包着res
          return res;
        } else {
          //过期了
          const accessToken = await this.getAccessToken();
          await this.saveAccessToken('./accessToken.txt', accessToken);
          //作为then函数返回值， promise对象包着accessToken
          return accessToken;
        }
      })
      .catch(async err => {
        const accessToken = await this.getAccessToken();
        await this.saveAccessToken('./accessToken.txt', accessToken);
        return accessToken;
      })
      .then(res => {
        //不管上面成功或者失败都会来到这
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;

        return Promise.resolve(res);
      })
  };

}

(async () => {
  /*
   读取本地保存access_token（readAccessToken）
   - 有
   - 判断是否过期（isValidAccessToken）
   - 过期了, 重新发送请求，获取access_token（getAccessToken），保存下来（覆盖之前的）(saveAccessToken)
   - 没有过期, 直接使用
   - 没有
   - 发送请求，获取access_token，保存下来
   */
  const w = new Wechat();

  let result = await w.fetchAccessToken();
  console.log(result);
  result = await w.fetchAccessToken();
  console.log(result);

})();
