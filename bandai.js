// ==UserScript==
// @name                Bandai Internationalization
// @name:zh-CN          日魂汉化插件
// @version             2.1
// @namespace           https://github.com/liyuhaolol/BandaiJS
// @description         Translate Bandai.com
// @description:zh      日魂汉化插件
// @description:zh-CN   日魂汉化插件
// @author              菜狗子
// @updateURL           https://fastly.jsdelivr.net/gh/liyuhaolol/BandaiJS/bandai.js
// @downloadURL         https://fastly.jsdelivr.net/gh/liyuhaolol/BandaiJS/bandai.js
// @match               *://p-bandai.jp/*
// @match               *://search.p-bandai.jp/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://www.githubs.cn/raw-githubusercontent/liyuhaolol/BandaiTranslate/main/bandai.json
// @require             https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
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
  var patt35 = /ローエングリンランチャー/;
  var patt36 = /ストライクルージュ/;
  var patt37 = /グランドスラム装備型/;
  var patt38 = /オオトリ装備/;
  var patt39 = /カレトヴルッフ/;
  var patt40 = /オプションセット/;
  var patt41 = /アストレイドライグヘッド/;
  var patt42 = /フライトユニット/;
  var patt43 = /オルタナティブストライクVer./;
  var patt44 = /ガンダムアストレイ/;
  var patt45 = /レッドドラゴニクス/;
  var patt46 = /スナイパーパック/;
  var patt47 = /ブルーフレームセカンドリバイ/;
  var patt48 = /インフィニットジャスティスガンダム/;
  var patt49 = /魂ウェブ商店/;
  var patt50 = /プレミアムバンダイ/;
  var patt51 = /バンダイナムコグループ公式通販サイト/;
  var patt52 = /フィギュア/;
  var patt53 = /プラモデル/;
  var patt54 = /プラキット/;
  var patt55 = /シリーズ/;
  var patt56 = /その他/;
  var patt57 = /ガンダムシリーズ/;//需特殊优先处理
  var patt58 = /水星の魔女/;
  var patt59 = /発送月から探す/;
  var patt60 = /ドラゴンボール/;
  var patt61= /ブランドから探す/;
  var patt62= /キャラクターから探す/;
  var patt63= /締切間近/;
  


  translateTitle();//开始翻译标题
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

  //进行页面标题翻译
  function translateTitle(){
    var pageTitle = document.title;
    document.title = beginTranslate(pageTitle);
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

    var value = beginTranslate(key);
    el[k] = el[k].replace(txtSrc, value)
  }

  function beginTranslate(key){
    var value = key;
    if (locales.dict[key]) {
      value =  locales.dict[key];
    }else {
      //主要用来翻译带有发货字样的文本
      if (patt59.test(key)) {
        value = value.replace('発送月から探す', '按发货月份搜索')
      }else if (patt2.test(key)) {
        value = value.replace('発送商品', '发货产品');
      }else if (patt26.test(key)) {
        value = value.replace('発送分', '发货')
      }else if (patt31.test(key)) {
        value = value.replace('発送予定', '预定发货')
      }else if (patt1.test(key)) {
        value = value.replace('発送', '发货')
      }
      //主要用来翻译一些杂项
      if (patt57.test(key)) {
        value = value.replace('ガンダムシリーズ', '高达系列')
      }else if (patt3.test(key)) {
        value = value.replace('円（税込）', '日元（含税）')
        value = value.replace('円 （税込）', '日元（含税）')
      }else if (patt4.test(key)) {
        value = value.replace('歳～', '岁以上')
      }else if (patt5.test(key)) {
        value = value.replace('お一人様', '每人最多购买')
        value = value.replace('個まで', '个')
      }else if (patt6.test(key)) {
        value = value.replace('注文につき', '单最多购买')
        value = value.replace('個まで', '个')
      }else if (patt7.test(key)) {
        value = value.replace('円', '日元')
      }else if (patt8.test(key)) {
        value = value.replace('同時購入数は', '最多可同时购买')
        value = value.replace('個までとなっております。', '件物品。')
      }else if (patt9.test(key)) {
        value = value.replace('円(税込)', '日元(含税)')
        value = value.replace('円 (税込)', '日元(含税)')
      }else if (patt24.test(key)) {
        value = value.replace('予約開始', '开始预订')
      }else if (patt33.test(key)) {
        value = value.replace('ページ', '页')
      }else if (patt55.test(key)) {
        value = value.replace('シリーズ', '系列')
      }else if (patt56.test(key)) {
        value = value.replace('その他', '其他')
      }else if (patt61.test(key)) {
        value = value.replace('ブランドから探す', '按品牌搜索')
      }else if (patt62.test(key)) {
        value = value.replace('キャラクターから探す', '按关键字搜索')
      }else if (patt63.test(key)) {
        value = value.replace('締切間近', '近期截止')
      }else if (patt32.test(key)) {
        value = value.replace('締切', '截止')
      }
      //翻译一些标题内容
      if (patt49.test(key)) {
        value = value.replace('魂ウェブ商店', '魂商店')
      }
      if (patt50.test(key)) {
        value = value.replace('プレミアムバンダイ', 'Premium Bandai')
      }
      if (patt51.test(key)) {
        value = value.replace('バンダイナムコグループ公式通販サイト', '万代南梦宫集团官方线上销售网站')
      }
      if (patt52.test(key)) {
        value = value.replace('フィギュア', '手办')
      }
      if (patt53.test(key)) {
        value = value.replace('プラモデル', '塑料模型')
      }
      if (patt54.test(key)) {
        value = value.replace('プラキット', '塑料配件')
      }
      //翻译一些作品名
      if (patt10.test(key)) {
          value = value.replace('機動戦士ガンダム', '机动战士高达')
        if (patt11.test(key)) {
          value = value.replace('逆襲のシャア', '逆袭的夏亚')
        }else if (patt12.test(key)) {
          value = value.replace('サンダーボルト', '雷霆宙域')
        }else if (patt13.test(key)) {
          value = value.replace('閃光のハサウェイ', '闪光的哈萨维')
        }else if (patt14.test(key)) {
          value = value.replace('第０８ＭＳ小隊', '第08MS小队')
        }else if (patt15.test(key)) {
          value = value.replace('ポケットの中の戦争', '口袋里的战争')
        }else if (patt16.test(key)) {
          value = value.replace('鉄血のオルフェンズ', '铁血的奥尔芬斯')
        }else if (patt17.test(key)) {
          value = value.replace('ユニコーン', '独角兽')
        }else if (patt58.test(key)) {
          value = value.replace('水星の魔女', '水星的魔女')
        }
      }else if (patt18.test(key)) {
        value = value.replace('仮面ライダー', '假面骑士')
      }else if (patt19.test(key)) {
        value = value.replace('鬼滅の刃', '鬼灭之刃')
      }else if (patt22.test(key)) {
        value = value.replace('聖闘士聖衣神話', '圣斗士圣衣神话')
      }else if (patt23.test(key)) {
        value = value.replace('エヴァンゲリオン', '新世纪福音战士')
      }else if (patt60.test(key)) {
        value = value.replace('ドラゴンボール', '龙珠')
      }
      //翻译一些SEED名称主词条
      if (patt20.test(key)) {
        value = value.replace('ストライクガンダム', '强袭高达')
      }else if (patt21.test(key)) {
        value = value.replace('エールストライカー', '翔翼型强袭装备')
      }else if (patt29.test(key)) {
        value = value.replace('ストライクフリーダムガンダム', '强袭自由高达')
      }else if (patt30.test(key)) {
        value = value.replace('デスティニーガンダム', '命运高达')
      }else if (patt35.test(key)) {
        value = value.replace('ローエングリンランチャー', '阳电子炮')
      }else if (patt36.test(key)) {
        value = value.replace('ストライクルージュ', '嫣红强袭高达')
      }else if (patt39.test(key)) {
        value = value.replace('カレトヴルッフ', '王者之剑')
      }else if (patt41.test(key)) {
        value = value.replace('アストレイドライグヘッド', '异端高达红色机红龙形态配件包')
      }else if (patt42.test(key)) {
        value = value.replace('フライトユニット', '飞行背包')
      }else if (patt44.test(key)) {
        value = value.replace('ガンダムアストレイ', '异端高达')
      }else if (patt46.test(key)) {
        value = value.replace('スナイパーパック', '狙击背包')
      }else if (patt48.test(key)) {
        value = value.replace('インフィニットジャスティスガンダム', '无限正义高达')
      }
     //翻译一些SEED名称附词条
     if (patt37.test(key)) {
       value = value.replace('グランドスラム装備型', '斩舰刀装备型')
     }else if (patt38.test(key)) {
       value = value.replace('オオトリ装備', '凤装备型')
     }else if (patt40.test(key)) {
       value = value.replace('オプションセット', 'OPTION套装')
     }else if (patt45.test(key)) {
       value = value.replace('レッドドラゴニクス', '红龙改形态')
     }else if (patt47.test(key)) {
       value = value.replace('ブルーフレームセカンドリバイ', '蓝色机二型改')
     }
     //翻译一些SEED名称三级词条
     if (patt43.test(key)) {
       value = value.replace('オルタナティブストライクVer.', 'AS Ver.')
     }
      //翻译销售类型
      if (patt25.test(key)) {
        value = value.replace('抽選販売', '抽选销售')
      }
      if (patt27.test(key)) {
        value = value.replace('開催記念商品', '纪念产品')
      }
      if (patt28.test(key)) {
        value = value.replace('イベント開催記念物販', '活动纪念特卖品')
      }
      if (patt34.test(key)) {
        value = value.replace('特別販売', '特别销售')
      }
    }
    return value;
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
