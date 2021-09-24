// ==UserScript==
// @name                Bandai Internationalization
// @name:zh-CN         日魂汉化插件
// @version             1.2
// @description         Translate Bandai.com
// @description:zh     日魂汉化插件
// @description:zh-CN   日魂汉化插件
// @author              菜狗子
// @match               *://p-bandai.jp/*
// @match               *://search.p-bandai.jp/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://gitee.com/NewMoonStyle/BandaiTranslate/raw/master/bandai.json
// @require             https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
  'use strict';

  const SUPPORT_LANG = ["zh-CN"];//设置语言为简体中文
  const lang = (navigator.language || navigator.userLanguage);
  const locales = getLocales(lang)
  //一些正则表达式
  var patt1 = /発送/;
  var patt2 = /発送商品/;
  var patt3 = /円\s?（税込）$/;
  var patt4 = /歳～$/;
  var patt5 = /^お一人様\d{1,}個まで$/;
  var patt6 = /^\d{1,}注文につき\d{1,}個まで$/;
  var patt7 = /円$/;
  var patt8 = /同時購入数は\d{1,}個までとなっております。/;
  var patt9 = /円\s?\(税込\)$/;
  var patt10 = /機動戦士ガンダム/;
  var patt11 = /逆襲のシャア/;
  var patt12 = /サンダーボルト/;
  var patt13 = /閃光のハサウェイ/;
  var patt14 = /第０８ＭＳ小隊/;
  var patt15 = /ポケットの中の戦争/;
  var patt16 = /鉄血のオルフェンズ/;
  var patt17 = /ユニコーン/;
  var patt18 = /仮面ライダー/;
  var patt19 = /鬼滅の刃/;
  var patt20 = /ストライクガンダム/;
  var patt21 = /エールストライカー/;
  var patt22 = /聖闘士聖衣神話/;
  var patt23 = /エヴァンゲリオン/;
  var patt24 = /予約開始$/;
  var patt25 = /抽選販売/;
  var patt26 = /発送分/;
  var patt27 = /開催記念商品/;
  var patt28 = /イベント開催記念物販/;
  var patt29 = /ストライクフリーダムガンダム/;
  var patt30 = /デスティニーガンダム/;
  var patt31 = /発送予定/;
  var patt32 = /締切/;
  var patt33 = /ページ/;
  var patt34 = /特別販売/;


  traverseElement(document.body);//开始翻译网页
  watchUpdate();//监控网页内容变化

  //读取本地翻译文件
  function getLocales(lang) {
    if(lang.startsWith("zh")) { // zh zh-TW --> zh-CN
      lang = "zh-CN";
    }
    if(SUPPORT_LANG.includes(lang)) {
      return JSON.parse(GM_getResourceText(lang));
    }
    //如果读取文件失败了，返回一个默认结构
    return {
      //css: [],
      dict: {}
    };
  }

  //进行网页翻译
  function traverseElement(el) {
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        //如果是文字节点，继续翻译
        translateElement(child);
      }
      else if(child.nodeType === Node.ELEMENT_NODE) {
        //如果是元素节点
        if (child.tagName === "INPUT") {
          translateElement(child);//是个input进行元素翻译
        } else {
          traverseElement(child);
        }
      } else {
        // pass
      }
    }
  }

  //翻译元素内容
  function translateElement(el) {
    // Get the text field name
    let k;
    if(el.tagName === "INPUT") {
      if (el.type === 'button' || el.type === 'submit') {
        k = 'value';
      } else {
        k = 'placeholder';
      }
    } else {
      k = 'data';
    }

    const txtSrc = el[k].trim();
    const key = txtSrc
      .replace(/\xa0/g, ' ') // replace '&nbsp;'
      .replace(/\s{2,}/g, ' ')
      .replace(/[\r\n]/g,'');

    if (locales.dict[key]) {
      el[k] = el[k].replace(txtSrc, locales.dict[key])
    }else {
      //主要用来翻译带有发货字样的文本
      if (patt2.test(key)) {
        el[k] = el[k].replace('発送商品', '发货产品')
      }else if (patt26.test(key)) {
        el[k] = el[k].replace('発送分', '发货')
      }else if (patt31.test(key)) {
        el[k] = el[k].replace('発送予定', '预定发货')
      }else if (patt1.test(key)) {
        el[k] = el[k].replace('発送', '发货')
      }
      //主要用来翻译一些杂项
      if (patt3.test(key)) {
        el[k] = el[k].replace('円（税込）', '日元（含税）')
        el[k] = el[k].replace('円 （税込）', '日元（含税）')
      }else if (patt4.test(key)) {
        el[k] = el[k].replace('歳～', '岁以上')
      }else if (patt5.test(key)) {
        el[k] = el[k].replace('お一人様', '每人最多购买')
        el[k] = el[k].replace('個まで', '个')
      }else if (patt6.test(key)) {
        el[k] = el[k].replace('注文につき', '单最多购买')
        el[k] = el[k].replace('個まで', '个')
      }else if (patt7.test(key)) {
        el[k] = el[k].replace('円', '日元')
      }else if (patt8.test(key)) {
        el[k] = el[k].replace('同時購入数は', '最多可同时购买')
        el[k] = el[k].replace('個までとなっております。', '件物品。')
      }else if (patt9.test(key)) {
        el[k] = el[k].replace('円(税込)', '日元(含税)')
        el[k] = el[k].replace('円 (税込)', '日元(含税)')
      }else if (patt24.test(key)) {
        el[k] = el[k].replace('予約開始', '开始预订')
      }else if (patt32.test(key)) {
        el[k] = el[k].replace('締切', '截止')
      }else if (patt33.test(key)) {
        el[k] = el[k].replace('ページ', '页')
      }
      //翻译一些作品名
      if (patt10.test(key)) {
        el[k] = el[k].replace('機動戦士ガンダム', '机动战士高达')
        if (patt11.test(key)) {
          el[k] = el[k].replace('逆襲のシャア', '逆袭的夏亚')
        }else if (patt12.test(key)) {
          el[k] = el[k].replace('サンダーボルト', '雷霆宙域')
        }else if (patt13.test(key)) {
          el[k] = el[k].replace('閃光のハサウェイ', '闪光的哈萨维')
        }else if (patt14.test(key)) {
          el[k] = el[k].replace('第０８ＭＳ小隊', '第08MS小队')
        }else if (patt15.test(key)) {
          el[k] = el[k].replace('ポケットの中の戦争', '口袋里的战争')
        }else if (patt16.test(key)) {
          el[k] = el[k].replace('鉄血のオルフェンズ', '铁血的奥尔芬斯')
        }else if (patt17.test(key)) {
          el[k] = el[k].replace('ユニコーン', '独角兽')
        }
      }else if (patt18.test(key)) {
        el[k] = el[k].replace('仮面ライダー', '假面骑士')
      }else if (patt19.test(key)) {
        el[k] = el[k].replace('鬼滅の刃', '鬼灭之刃')
      }else if (patt22.test(key)) {
        el[k] = el[k].replace('聖闘士聖衣神話', '圣斗士圣衣神话')
      }else if (patt23.test(key)) {
        el[k] = el[k].replace('エヴァンゲリオン', '新世纪福音战士')
      }
      //翻译一些SEED名称
      if (patt20.test(key)) {
        el[k] = el[k].replace('ストライクガンダム', '强袭高达')
      }else if (patt21.test(key)) {
        el[k] = el[k].replace('エールストライカー', '翔翼型强袭装备')
      }else if (patt29.test(key)) {
        el[k] = el[k].replace('ストライクフリーダムガンダム', '强袭自由高达')
      }else if (patt29.test(key)) {
        el[k] = el[k].replace('デスティニーガンダム', '命运高达')
      }
      //翻译销售类型
      if (patt25.test(key)) {
        el[k] = el[k].replace('抽選販売', '抽选销售')
      }
      if (patt27.test(key)) {
        el[k] = el[k].replace('開催記念商品', '纪念产品')
      }
      if (patt28.test(key)) {
        el[k] = el[k].replace('イベント開催記念物販', '活动纪念特卖品')
      }
      if (patt34.test(key)) {
        el[k] = el[k].replace('特別販売', '特别销售')
      }
    }
  }

  //监控网页的内容变化
  function watchUpdate() {
    const m = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new m(function (mutations, observer) {
      for(let mutationRecord of mutations) {
        for(let node of mutationRecord.addedNodes) {
          traverseElement(node);//网页内容发生变化去翻译
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }
})();
