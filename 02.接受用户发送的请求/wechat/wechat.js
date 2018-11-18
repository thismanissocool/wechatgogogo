/**
 * Created by Administrator on 2018/11/17.
 */
const rq = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID, appSecret} = require('../configg');


class Wechat {
  /**
   * 获取access_token
   * @return {Promise<result>}
   */
 async getAccessToken () {
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appSecret}';
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

}
