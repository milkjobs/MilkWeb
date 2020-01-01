import { makeStyles, Theme } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import qs from "qs";
import { Link, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { openInNewTab, checkUrl } from "helpers";
import { useMediaQuery } from "@material-ui/core";

interface Company {
  name: string;
  key: string;
  logoUrl: string;
  link: string;
  description: string;
}

const majorDict = {
  ee: {
    name: "台大電機",
    companies: [
      {
        name: "華碩",
        key: "1",
        logoUrl: "https://www.asus.com/media/img/2017/images/n-logo-asus.svg",
        link: "https://hr-recruit.asus.com/",
        description: "華碩電腦"
      },
      {
        name: "台積電",
        key: "2",
        logoUrl: "https://www.tsmc.com/img/logo.png",
        link:
          "https://tsmc.taleo.net/careersection/tsmc_exti/jobdetail.ftl?job=1900008Z&lang=zh_TW",
        description: "世界第一的半導體設計廠"
      },
      {
        name: "聯發科",
        key: "3",
        logoUrl: "https://cdn-www.mediatek.com/icons/mtklogo.svg",
        link: "https://careers.mediatek.com/eREC/?langKey=zh-TW&langKey=zh-TW",
        description:
          "無線通訊、高清電視、5G提供系统晶片解決方案的無廠半導體公司"
      },
      {
        name: "聯詠科技",
        key: "4",
        logoUrl: "http://www.novatek.com.tw/templates/default/images/logo.png",
        link: "https://www.104.com.tw/company/12nopku0?jobsource=n104bank1",
        description: "聯詠科技為國內IC設計領導廠商，從事產品設計，研發及銷售。"
      },
      {
        name: "瑞昱半導體",
        key: "5",
        logoUrl: "https://www.realtek.com/images/realtek_logo.png",
        link: "https://recruit.realtek.com/zh/",
        description:
          "憑藉著7位創始工程師的熱情與毅力，走過風雨飄搖的草創時期，我們不僅堅持信念，努力執著鑽研，更洞悉市場需求，因而造就了今日的瑞昱，成為國際知名IC專業設計公司。"
      },
      {
        name: "立錡科技",
        key: "6",
        logoUrl:
          "https://richtek.referrals.selectminds.com/media/client_3_s2_r0_v1524817811639_main.png",
        link: "https://richtek.referrals.selectminds.com/jobs/search/27768",
        description:
          "國際級的電源管理IC設計公司。專注於提供客戶最多元且最具競爭力的電源管理IC產品以及完整的電源解決方案。"
      },
      {
        name: "高通",
        key: "7",
        logoUrl:
          "http://thearea.org/wp-content/uploads/2019/03/qc_logo_dml_rgb_blu_pos.png",
        link: "https://jobs.qualcomm.com/public/search.xhtml",
        description: "位於美國加州聖地牙哥的無線電通信技術研發公司。"
      },
      {
        name: "奇景光電",
        key: "8",
        logoUrl:
          "https://img.technews.tw/wp-content/uploads/2015/01/Hima-logo.jpg",
        link: "https://www.himax.com.tw/zh/company/careers/",
        description: "專注於影像顯示處理技術之IC設計公司。"
      },
      {
        name: "宏碁",
        key: "9",
        logoUrl:
          "https://c.share.photo.xuite.net/yuan6133/1cd27e2/7253464/279601162_m.jpg",
        link: "https://www.acer.com/ac/zh/TW/content/global-recruiting",
        description:
          "Acer 的產品範圍涵蓋筆記型電腦、桌上型電腦、平板電腦、智慧型手機、顯示器、投影機以及雲端解決方案，適合家庭使用者、企業、政府與教育機構使用。"
      },
      {
        name: "HTC",
        key: "10",
        logoUrl: "https://logodix.com/logo/32418.png",
        link: "https://www.htc.com/tw/working/join/",
        description:
          "HTC VIVE 開創了虛擬實境系統之先河。體驗全新虛擬世界，讓自己沉浸於視覺、身體和情感震撼之中。"
      },
      {
        name: "安霸",
        key: "11",
        logoUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQadrq_UoG8Fqs4Wm1hDYR9itvq1c8yAfQz1pJ3SHKu9eOEmE4x&s",
        link:
          "https://chp.tbe.taleo.net/chp02/ats/careers/v2/jobSearch?org=AMBARELLA2015&cws=50",
        description:
          "安霸(Ambarella)，2004年1月於美國矽谷正式設立，為美商Benchmark及多位專業研發人員合資成立之公司，並迅速成為數位多媒體核心處理器之領導廠商。"
      },
      {
        name: "慧榮科技",
        key: "12",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Silicon_Motion_logo.svg/500px-Silicon_Motion_logo.svg.png",
        link: "http://cht.siliconmotion.com/hr/A7.0_HR.php",
        description:
          "慧榮科技是NAND Flash快閃記憶體控制晶片的全球領導者，擁有超過20年的設計開發經驗，為SSD及其他固態儲存裝置提供領先業界的高效能儲存解決方案，應用範圍包括智慧型手機、個人電腦、資料中心、商業及工控應用。。"
      },
      {
        name: "晶豪科技",
        key: "13",
        logoUrl:
          "https://www.krom.com.tw/UserFiles/goods/64/b/20150813182840_0.jpg",
        link: "https://www.esmt.com.tw/zh-tw",
        description:
          "晶豪科技股份有限公司為一專業 IC 設計公司，於 1998 年 6 月成立於台灣之新竹科學工業園區。本公司主要業務包含自有品牌之 IC 產品設計、製造、銷售及技術服務，並已於 2002 年 3 月在臺灣證券交易所掛牌上市，代號3006。"
      },
      {
        name: "Google",
        key: "14",
        logoUrl:
          "https://inside-assets2.inside.com.tw/2015/09/Googlelogo2015sd.jpg?auto=compress&fit=max&w=730",
        link:
          "https://careers.google.com/jobs/results/?company=Google&company=YouTube&hl=en&jlo=en-US&location=Taipei,%20Taiwan",
        description:
          "Google有限公司是源自美國的跨國科技公司，為Alphabet Inc.的子公司，業務範圍涵蓋網際網路廣告、網際網路搜尋、雲端運算等領域，開發並提供大量基於網際網路的產品與服務，其主要利潤來自於AdWords等廣告服務。"
      },
      {
        name: "友達光電",
        key: "15",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/zh/thumb/1/14/AUO_logo.svg/440px-AUO_logo.svg.png",
        link: "https://www.auo.com/zh-TW/Join_AUO/index/Job_Opportunity",
        description:
          "友達光電為TFT-LCD設計、製造及研發公司，2008年起進軍綠能產業，提供客戶高效率太陽能解決方案。"
      },
      {
        name: "台灣應用材料",
        key: "16",
        logoUrl:
          "http://www.appliedmaterials.com/sites/all/themes/appliedmaterials_clean/images/AMATlogo.jpg",
        link: "http://www.appliedmaterials.com/zh-hant/company/careers/jobs",
        description:
          "應用材料公司簡稱應材，是全球最大的半導體設備和服務供應商。應用材料公司創建於1967年，公司總部位於美國加利福尼亞州聖克拉拉。"
      },
      {
        name: "廣達電腦",
        key: "17",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/zh/thumb/9/9b/Quanta_Computer_logo.svg/440px-Quanta_Computer_logo.svg.png",
        link: "https://hr.quantatw.com/webrecruit/",
        description:
          "廣達電腦成立於1988年，是全球主要的筆記型電腦研發設計製造公司之一。除了在筆記型電腦的領域中取得一席之地外，更將觸角延伸到雲端運算及企業網路系統解決方案、行動通訊技術、智慧家庭產品、汽車電子、智慧醫療、物聯網及人工智慧應用等市場，積極拓展產業領域、開創商機，並整合相關資源進行佈局。"
      },
      {
        name: "聯華電子",
        key: "18",
        logoUrl:
          "https://blackmarble.com.tw/wp-content/uploads/2017/04/2016_03_18_2020031.jpg",
        link: "http://hr.umc.com/index.asp",
        description:
          "聯華電子身為半導體晶圓專工業界的領導者，提供先進製程與晶圓製造服務，為IC產業各項主要應用產品生產晶片。聯電完整的解決方案能讓晶片設計公司利用尖端製程的優勢，包括28奈米Poly-SiON技術、High-K/Metal Gate後閘極技術、14奈米量產、超低功耗且專為物聯網（IoT）應用設計的製程平台以及具汽車行業最高評級的AEC-Q100 Grade-0製造能力，用於生產汽車中的IC。"
      },
      {
        name: "鴻海",
        key: "19",
        logoUrl: "https://www.foxconn.com.tw/assets/img/logo.png",
        link: "https://recruit.foxconn.com/isite-web/mbMain.init.do",
        description:
          "作為科技服務的領先者，近年來集團積極運用「硬軟整合、實虛結合」，深度佈局「雲、移、物、大、智、網 + 機器人」，掌握工業互聯網產業DT(Data Tech)、AT(Analytics Tech)、PT(Platform Tech)、OT(Operations Tech)四大關鍵技術，投資並充分利用集團在雲計算，移動設備，物聯網，大數據，人工智能，網絡，機器人及自動化方面的專業知識。"
      },
      {
        name: "微軟",
        key: "20",
        logoUrl:
          "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
        link:
          "https://careers.microsoft.com/us/en/search-results?keywords=taiwan",
        description:
          "微軟是全球科技產業的領航者，提供全球領先的軟體、服務、設備和解決方案，自 1975 年成立以來，一直致力於幫助個人和企業用戶，全面發揮科技潛能，實現夢想。"
      },
      {
        name: "緯創資通",
        key: "21",
        logoUrl:
          "http://www.ypdesigngroup.com/images/wistron-logo-1320x192_2x.jpg",
        link: "https://career.wistron.com/w/Wistron/index",
        description:
          "緯創資通是全球最大的資訊及通訊產品專業設計及代工廠商之一。目前全球擁有8個研發支援中心、9個製造基地、15個客服中心及全球維修中心，共有80000位以上的專業人才架構堅實的全球營運網絡。產品涵蓋筆記型電腦、桌上型電腦、平板電腦、智慧型手機、伺服器、網路家電產品、有線及無線數據通訊、數位消費性電子產品等。"
      },
      {
        name: "明基佳世達",
        key: "22",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/zh/thumb/5/5b/Qisda_logo.svg/440px-Qisda_logo.svg.png",
        link: "https://www.qisda.com/page.aspx?uid=32",
        description:
          "佳世達科技股份有限公司(Qisda Corporation)，1984年成立，從明碁電腦、明基電通沿革至今已擁有超過三十年的歷史！佳世達科技為一間跨領域之全方位電子設計製造服務公司，在產業價值鏈上擔任技術及系統發展整合之角色，年營收超過1000億元，全球員工近10000人！"
      },
      {
        name: "Gogoro",
        key: "23",
        logoUrl:
          "https://www.gogoro.com/uploads/pages/1-og-image-e13087d4cf2d4a0c71f209549fb0d2ffa6f2b45f.png?1540538640",
        link: "https://www.gogoro.com/tw/career/",
        description:
          "顛覆你對電動機車的想像！Gogoro，以智慧雙輪、電池交換站及智慧電池座，打造城市交通及能源新思維。"
      },
      {
        name: "創意電子",
        key: "24",
        logoUrl:
          "http://www.globalunichip.com/upload/media/statement/GUC-Logo-RGB.jpg",
        link: "http://www.globalunichip.com/zh-tw/employment/index/hot_jobs",
        description:
          "創意電子(GLOBAL UNICHIP CORP.，GUC)是客製化IC領導廠商(The customer ASIC Leader)，總部位於台灣，提供完整的先進客製化IC服務(The Advanced ASIC Services)，滿足當今創新科技公司獨一無二的業務與技術需求。"
      },
      {
        name: "Synopsys",
        key: "25",
        logoUrl:
          "https://www.synopsys.com/content/dam/synopsys/company/about/legal/synopsys-logos/colorlogo/synopsys_color.png",
        link:
          "https://sjobs.brassring.com/TGnewUI/Search/Home/Home?partnerid=25235&siteid=5359#keyWordSearch=&locationSearch=Taiwan",
        description:
          "新思科技股份有限公司（NASDAQ：SNPS，Synopsys Inc.）名列美國標普500指數成分股，長期以來是全球排名第一的IC電子設計自動化（EDA）創新公司，也是排名第一的IC介面IP供應廠商，專門提供「矽晶到軟體（Silicon to Software™）」最佳的解決方案。不論是針對開發先進半導體系統單晶片（SoC）的設計工程師，或正在撰寫應用程式且要求高品質及安全性的軟體開發工程師，新思科技都能提供所需的解決方案，以協助工程師完成創新、高品質並兼具安全性的產品。"
      }
    ]
  },
  cs: {
    name: "台大資工",
    companies: [
      {
        name: "Google",
        key: "1",
        logoUrl:
          "https://inside-assets2.inside.com.tw/2015/09/Googlelogo2015sd.jpg?auto=compress&fit=max&w=730",
        link:
          "https://careers.google.com/jobs/results/?company=Google&company=YouTube&hl=en&jlo=en-US&location=Taipei,%20Taiwan",
        description:
          "Google有限公司是源自美國的跨國科技公司，為Alphabet Inc.的子公司，業務範圍涵蓋網際網路廣告、網際網路搜尋、雲端運算等領域，開發並提供大量基於網際網路的產品與服務，其主要利潤來自於AdWords等廣告服務。"
      },
      {
        name: "QNAP",
        key: "2",
        logoUrl: "https://www.qnap.com/assets/img/home/qnap-logo-black.svg",
        link: "https://www.qnap.com/zh-tw/about/con_show.php?op=showone&cid=3",
        description:
          "威聯通科技股份有限公司 (QNAP Systems, Inc.) 立足台灣台北，提供全面且先進的 NAS 網路儲存與影像監控解決方案，讓使用者享有操作簡單、高安全性、並可彈性擴充的數位應用管理中心。優異的 NAS 產品不僅增進檔案儲存、備份/快照、虛擬化應用、與協同合作的效率，同時提供多媒體影音體驗，豐富數位娛樂生活。威聯通更跨足物聯網領域，並整合人工智慧 (A.I.) 與機器學習 (Machine Learning) 技術，期盼將 QNAP NAS 進化為智能管理中樞，為人類生活創造更多可能性。"
      },
      {
        name: "Appier",
        key: "3",
        logoUrl:
          "https://www.appier.com/wp-content/uploads/2018/09/appier-logo.jpg",
        link: "https://www.appier.com/zh-hant/careers/",
        description:
          "Appier是一家專注於人工智慧的科技公司，藉由開發各種人工智慧應用平台，協助企業解決最棘手的商業挑戰。"
      },
      {
        name: "訊連科技",
        key: "4",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/zh/thumb/a/a7/CyberLink_Logo.svg/1200px-CyberLink_Logo.svg.png",
        link: "https://tw.cyberlink.com/index_zh_TW.html",
        description:
          "訊連科技 (5203.TW) 創立於 1996 年，為全球首屈一指的多媒體影音及 AI 臉部辨識技術開發商。在超過 200 項專利、穩固的技術基礎上，訊連科技持續進行革命性的多媒體創新，具前瞻性的遠見使訊連科技快速成長並創造最先進的軟體解決方案。"
      },
      {
        name: "skymizer",
        key: "5",
        logoUrl: "https://jobs.aiacademy.tw/job_logo_crop/BcN6h_skymizer.jpg?1",
        link: "https://blog.skymizer.com/2019/01/08/jobs2019/#more-363",
        description:
          "Skymizer 是頂尖的編譯與虛擬化技術團隊，幫助客戶建立各式的虛擬機與編譯器，增加軟體效能、縮短 time-to-market 時間；目前我們已與世界級的公司合作，一起開發供深度學習 (deep learning) ASIC 使用的編譯器，與新一代區塊鏈上的智能合約 (smart contract) 所使用的虛擬機。"
      },
      {
        name: "微軟",
        key: "6",
        logoUrl:
          "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
        link:
          "https://careers.microsoft.com/us/en/search-results?keywords=taiwan",
        description:
          "微軟是全球科技產業的領航者，提供全球領先的軟體、服務、設備和解決方案，自 1975 年成立以來，一直致力於幫助個人和企業用戶，全面發揮科技潛能，實現夢想。"
      },
      {
        name: "精誠資訊",
        key: "7",
        logoUrl:
          "https://i1.wp.com/smart2017.thu.edu.tw/wp-content/uploads/2016/05/logo_systex.png?fit=570%2C400",
        link: "https://tw.systex.com/join_career/",
        description:
          "精誠資訊SYSTEX Corporation 成立於1997年，是台灣資訊服務產業龍頭企業，擁有近3,000名員工，位居台灣前一百大服務業，為跨足兩岸三地及東南亞的亞洲區域級資訊服務集團公司，在兩岸三地共設有55個營運據點，2015年合併營收為新台幣163億元。"
      },
      {
        name: "Gogoro",
        key: "8",
        logoUrl:
          "https://www.gogoro.com/uploads/pages/1-og-image-e13087d4cf2d4a0c71f209549fb0d2ffa6f2b45f.png?1540538640",
        link: "https://www.gogoro.com/tw/career/",
        description:
          "顛覆你對電動機車的想像！Gogoro，以智慧雙輪、電池交換站及智慧電池座，打造城市交通及能源新思維。"
      },
      {
        name: "AWS",
        key: "9",
        logoUrl:
          "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
        link:
          "https://www.amazon.jobs/en/search?base_query=&loc_query=Taiwan&latitude=25.03737&longitude=121.56355&loc_group_id=&invalid_location=false&country=TWN&city=&region=&county=",
        description:
          "對喜歡發明的人而言，AWS 是一流的創造中心。我們目前正在全球招聘各種不同的科技和業務人才。加入AWS 並協助我們創造雲端運算的未來。"
      },
      {
        name: "IBM",
        key: "10",
        logoUrl:
          "https://www.ibm.com/innovate/branding/logoartwork/logoartwork.nsf/IBM_logoRR_pos_RGB.gif",
        link: "https://www.ibm.com/tw-zh/employment/entrylevel_campus.html",
        description:
          "在IBM，我們相信世界在不斷改變求進步：充分應用智慧、理性和科學來提升商業、科學及人類處境。"
      },
      {
        name: "緯創資通",
        key: "11",
        logoUrl:
          "http://www.ypdesigngroup.com/images/wistron-logo-1320x192_2x.jpg",
        link: "https://career.wistron.com/w/Wistron/index",
        description:
          "緯創資通是全球最大的資訊及通訊產品專業設計及代工廠商之一。目前全球擁有8個研發支援中心、9個製造基地、15個客服中心及全球維修中心，共有80000位以上的專業人才架構堅實的全球營運網絡。產品涵蓋筆記型電腦、桌上型電腦、平板電腦、智慧型手機、伺服器、網路家電產品、有線及無線數據通訊、數位消費性電子產品等。"
      },
      {
        name: "Yahoo 台灣",
        key: "12",
        logoUrl:
          "https://www.brandinlabs.com/wp-content/uploads/2019/09/%E6%96%B0LOGO%E7%B4%B0%E7%AF%80-5.png",
        link: "https://www.104.com.tw/company/cii6g14?jobsource=checkc",
        description:
          "雅虎是美國Verizon Media的子公司，為網際網路服務部門，品牌旗下知名服務有入口網站、電子信箱、體育以及新聞等服務。"
      },
      {
        name: "UmboCV",
        key: "13",
        logoUrl:
          "https://res.cloudinary.com/cakeresume/image/upload/s--TQxMpJrX--/c_pad,fl_png8,h_400,w_400/v1482125653/page__logo_1482125652.png",
        link: "https://umbocv.ai/join_us",
        description:
          "Umbo CV is advancing surveillance with a new neural network-based artificial intelligence capable of autonomously flagging relevant video events."
      },
      {
        name: "Hahow",
        key: "14",
        logoUrl:
          "https://blog.hahow.in/content/images/2016/11/Hahow-final-logo-cs6-1.png",
        link: "https://hahow.in/joinus",
        description:
          "Hahow 提供最多元有趣的線上課程，並透過獨特的課程募資機制，讓熱愛自學與交換技能的你，在家就可以完成高效率的線上學習與成就！"
      },
      {
        name: "Nvidia",
        key: "15",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/zh/thumb/6/6d/Nvidia_image_logo.svg/1200px-Nvidia_image_logo.svg.png",
        link:
          "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/3/refreshFacet/318c8bb6f553100021d223d9780d30be",
        description:
          "NVIDIA，創立於1993年1月，是一家以設計和銷售圖形處理器為主的無廠半導體公司。NVIDIA亦會設計遊戲機核心，例如Xbox和PlayStation。"
      },
      {
        name: "華碩",
        key: "16",
        logoUrl: "https://www.asus.com/media/img/2017/images/n-logo-asus.svg",
        link: "https://hr-recruit.asus.com/",
        description: "華碩電腦"
      },
      {
        name: "聯發科",
        key: "17",
        logoUrl: "https://cdn-www.mediatek.com/icons/mtklogo.svg",
        link: "https://careers.mediatek.com/eREC/?langKey=zh-TW&langKey=zh-TW",
        description:
          "無線通訊、高清電視、5G提供系统晶片解決方案的無廠半導體公司"
      },
      {
        name: "kkbox",
        key: "18",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/KKBOX_logo.svg/1280px-KKBOX_logo.svg.png",
        link: "https://www.kkbox.com/about/zh-tw/about/jobs",
        description:
          "KKBOX是源自臺灣的線上音樂串流服務平台，2005年10月率先在臺灣推出後，陸續於香港、澳門、新加坡、馬來西亞、日本及泰國等地開放服務，後於2016年退出泰國市場。目前由日本KDDI做為最大股東的KKBOX公司經營。"
      },
      {
        name: "趨勢科技",
        key: "19",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Trend-Micro-Logo.svg/1200px-Trend-Micro-Logo.svg.png",
        link: "https://careers.trendmicro.tw/",
        description:
          "趨勢科技是企業資料防護與網路資安解決方案的全球領導廠商，專門為企業環境、資料中心、雲端環境、網路及端點提供最佳的防護。"
      },
      {
        name: "VMWare",
        key: "20",
        logoUrl:
          "https://futurumresearch.com/wp-content/uploads/2019/08/VMware-Logo-200x200-01-1024x1024.png",
        link:
          "https://careers.vmware.com/main/jobs?location=Taiwan&stretch=10&stretchUnit=MILES&page=1",
        description:
          "VMware 軟體可奠定數位化基礎，推動各項應用程式、服務與體驗，繼而改變我們身處的世界。請按一下這裡深入瞭解。"
      },
      {
        name: "17直播",
        key: "21",
        logoUrl: "https://www.m17.asia/uploads/article/logo_17.png",
        link: "https://www.jobs.17.media/",
        description:
          "源自臺灣的即時影音串流平台，由臺灣歌手黃立成於2015年創辦，其特色是即時的相片和直播內容共享功能。"
      },
      {
        name: "91App",
        key: "22",
        logoUrl:
          "https://i1.wp.com/www.91app.com/wp-content/uploads/91app-logo-general-image.jpg?fit=1200%2C1200&ssl=1",
        link: "https://www.91app.com/careers/",
        description:
          "91APP 有超過 350 人的營運團隊，從產品開發到品牌輔導經營，全方位滿足零售品牌的需求。目前已經有超過 10,000 家大型品牌以及知名商店使用選擇了 91APP，包括：國際品牌 PHILIPS、Timberland、The North Face、Kipling、Keds、Durex，零售通路如全家便利商店、康是美，以及台灣知名品牌如 86 小舖、STUDIO A、SONICE 等。未來，91APP 將持續創新研發，透過虛實融合將線上網路與線下門市的力量充分發揮實現品牌全通路新零售經營。"
      },
      {
        name: "PicCollage",
        key: "23",
        logoUrl:
          "https://lever-client-logos.s3.amazonaws.com/d3a3ee68-c9b2-4d7b-a937-a927fe133f3d-1542840175073.png",
        link: "https://cardinalblue.com/careers/",
        description:
          "我們是來自矽谷的新創團隊PicCollage 拼貼趣，主要產品『PicCollage』是一個追求自由創造及分享的照片拼貼app，主要使用者來自美國、英國及日本等國家。"
      },
      {
        name: "WeMo",
        key: "24",
        logoUrl:
          "https://assets.meet.jobs/uploads/organization/1083/logo/WeMo.jpg",
        link: "https://www.wemoscooter.com/about",
        description:
          "WeMo Scooter 是亞洲第一個規模最大的「無站點式」智慧電動機車即時租借服務 ，目前已有2000台車輛(將持續增車)在大台北的大街小巷出現，擁有超過12萬會員及突破百萬次以上的租借。"
      }
    ]
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  },
  header: {
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    },
    fontWeight: 800
  },
  companyCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      padding: 8
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper
  },
  nameContainer: {
    display: "flex",
    marginLeft: 16,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    },
    flexDirection: "column"
  },
  logo: {
    maxWidth: 100,
    height: 100,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 40,
      height: 40
    },
    margin: 16,
    objectFit: "contain"
  },
  title: {
    fontSize: 24,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8
    }
  },
  description: {
    marginTop: 16,
    fontSize: 18,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginTop: 0
    },
    textAlign: "left"
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

const CompanyCard: React.FC<Company> = props => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  return (
    <div
      className={classes.companyCardContainer}
      onClick={() => openInNewTab(checkUrl(props.link))}
    >
      {!matched && <img src={props.logoUrl} className={classes.logo} />}
      <div className={classes.nameContainer}>
        <div className={classes.iconContainer}>
          {matched && <img src={props.logoUrl} className={classes.logo} />}
          <div className={classes.title}>{props.name}</div>
        </div>
        <div className={classes.description}>{props.description}</div>
      </div>
    </div>
  );
};

const JobSearch: React.FC = () => {
  const location = useLocation();
  const classes = useStyles();
  const [major, setMajor] = useState("ee");

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    if ("major" in params) setMajor(params.major);
  }, [location.search]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <Link
            to={{ pathname: "/ntu", search: "?major=ee" }}
            className={classes.majorButton}
          >
            <Button>台大電機</Button>
          </Link>
          <Link
            to={{ pathname: "/ntu", search: "?major=cs" }}
            className={classes.majorButton}
          >
            <Button>台大資工</Button>
          </Link>
        </div>
        <div className={classes.header}>
          精選{majorDict[major].name}
          畢業生，最常去的公司。先從這些公司開始應徵吧!
        </div>
        {majorDict[major].companies.map(c => (
          <CompanyCard key={c.key} {...c} />
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
