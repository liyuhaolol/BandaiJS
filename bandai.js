// ==UserScript==
// @name                Bandai Internationalization
// @name:zh-CN         日魂汉化插件
// @version             1.0
// @description         Translate Bandai.com
// @description:zh     日魂汉化插件
// @description:zh-CN   日魂汉化插件
// @author              菜狗子
// @match               https://p-bandai.jp/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://gitee.com/NewMoonStyle/BandaiTranslate/raw/master/bandai.json
// @require             https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
  'use strict';

  const SUPPORT_LANG = ["zh-CN"];
  const lang = (navigator.language || navigator.userLanguage);
  const locales = getLocales(lang)
  var patt1 = /^\d{4}年\d{1,2}月発送$/;
  var patt2 = /^▼\d{4}年\d{1,2}月発送商品$/;
  var patt3 = /円\s?（税込）$/;
  var patt4 = /歳～$/;
  var patt5 = /^お一人様\d{1}個まで$/;
  var patt6 = /^\d{1}注文につき\d{1}個まで$/;
  var patt7 = /円$/;
  var patt8 = /同時購入数は\d{1,}個までとなっております。/;


  traverseElement(document.body);
  watchUpdate();

  function getLocales(lang) {
    if(lang.startsWith("zh")) { // zh zh-TW --> zh-CN
      lang = "zh-CN";
    }
    if(SUPPORT_LANG.includes(lang)) {
      return JSON.parse(GM_getResourceText(lang));
    }
    return {
      dict: {}
    };
  }

  function traverseElement(el) {
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        translateElement(child);
      }
      else if(child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "INPUT") {
          translateElement(child);
        } else {
          traverseElement(child);
        }
      }
    }
  }

  function translateElement(el) {
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
      .replace(/\xa0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/[\r\n]/g,'');
    if (patt1.test(key)) {
      el[k] = el[k].replace('発送', '发货')
    }else if (patt2.test(key)) {
      el[k] = el[k].replace('発送商品', '发货产品')
    }else if (patt3.test(key)) {
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
    }else if (locales.dict[key]) {
      el[k] = el[k].replace(txtSrc, locales.dict[key])
    }
  }

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
