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

(async () => {
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
  console.log(result);

  await browser.close();
})();
