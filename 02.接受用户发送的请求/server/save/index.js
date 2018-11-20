/**
 * Created by Administrator on 2018/11/20.
 */
const Trailers = require('../../modles/trailers');

module.exports = async movies => {
  for (let i = 0; i < movies.length; i++) {
    let item = movies[i];
    await Trailers.create(item);
  }
};
