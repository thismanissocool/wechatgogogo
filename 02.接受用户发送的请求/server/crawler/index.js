/**
 * Created by Administrator on 2018/11/19.
 */
/*
 1. 爬虫：爬取网页的数据
 2. 原理：借助无头浏览器实现
 3. puppeteer 无头浏览器，通过它实现网页爬虫
 npm i puppeteer -D
 4. 使用：
 */
const puppeteer = require ('puppeteer');

module.exports = async () => {
  //1.打开浏览器
  const browser = await puppeteer.launch({
    headless: false
  });

  //2.打开标签页
  const page = await browser.newPage();

  //3.输入url地址
  await page.goto('https://movie.douban.com/coming', {waitUntil: 'load'});

  //4.等待页面加载完成，开始爬取数据
  const result = await page.evaluate(() => {
    let result = [];
    //爬取数据
  const $tds = $('.coming_list>tbody>tr').find('td:last');
    for (let i = 0; i < $tds.length; i++){
      let $td = $($tds[i]);
      let num = +$td.text().split('人')[0];
      if (num >= 1000) {
        const href = $td.parent().find('td:nth(1)>a').attr('href');
        result.push(href);
      }
    }
    return result;
  });
  // console.log(result);

  let movies = [];

  //开始第二次爬取
  for (let i = 0; i < result.length; i++) {
    try {
      const item = result[i];
      //跳转到新网页
      await page.goto(item, {waitUntil: 'load'});
      //开始爬取数据
      const data = await page.evaluate(() => {
        //yugaopian
        const $video = $('.related-pic-video');
        if (!$video.length){
          return null;
        }

        const href = $video.attr('href');
        const cover = $video.css('background-image').split('"')[1].split('?')[0];


        //biaoti
        const title = $('[property="v:itemreviewed"]').text();
        //pingfen
        const rating = $('[property="v:average"]').text();
        //haibao
        const image = $('[propetry="v:image"]').attr('src');
        //daoyan
        const director = $('[rel="v:directedBy"]').text();

        //zhuyan
        let casts = [];
        const $stars = $('[rel="v:starring"]');
        const length = $stars.length >3 ? 3 : $stars.length;
        for (let j = 0; j < length; j++) {
          casts.push($(($stars)[j]).text());
        }

        //leixing
        let genre = [];
        const $genre = $('[property="v:genre"]');
        for (let j = 0; j < $genre.length; j++) {
          genre.push($($($genre)[j]).text());
        }

        //shangyinshijian
        const releaseDate = $($('[property="v:initialReleaseDate"]')[0]).text();

        //juqingjianjie
        const summary = $('[property="v:summary"]').text().trim();

        return {
          href,
          cover,
          title,
          rating,
          image,
          director,
          casts,
          genre,
          releaseDate,
          summary
        }

      })
      if (!data){
        continue;
      }

      data.doubanId = item.split('subject/')[1].split('/')[0];
      movies.push(data);
    } catch (e){}

  }


  //第三次请求数据
  for (let i = 0; i < movies.length; i++) {
    let item = movies[i];
    await page.goto(item.href, {waitUntil: 'load'});
    const data = await page.evaluate(() => {
      return $('video>source').attr('src');
    })

    item.src = data;
  }
  console.log(movies);
  await browser.close();

  return movies;
}
