import { makeStyles, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import { Header } from "components/Header";
import Linkify from "react-linkify";
import { useParams, Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  postContainer: {
    margin: 8,
    borderRadius: 8,
    borderColor: theme.palette.text.secondary,
    borderStyle: "solid",
    borderWidth: 2,
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      margin: 0,
      borderRadius: 0,
      borderColor: theme.palette.divider,
      borderStyle: "solid",
      borderWidth: 0,
      borderBottomWidth: 4
    }
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
      width: "720px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  text: {
    textAlign: "left",
    fontSize: 16,
    lineHeight: 2
  },
  circleLink: {
    padding: 32,
    textDecoration: "none",
    fontSize: 18,
    color: theme.palette.text.secondary
  },
  iconButton: {
    padding: 10
  },
  searchRoot: {
    padding: "2px 4px",
    width: 650,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 16,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
      width: "90%"
    }
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  date: {
    color: theme.palette.text.hint,
    marginTop: 4
  },
  more: {
    cursor: "pointer",
    color: theme.palette.secondary.main
  }
}));

interface PostType {
  uuid: string;
  text: string;
  created: Date;
}

const posts: PostType[] = [
  {
    uuid: "16",
    text: `類比半導體龍頭－美商德州儀器 Texas Instruments 2020 暑期實習生
    在全球，德州儀器把第一顆IC帶到世人面前
    是半導體領域的先驅者
    理工界精英聚集的殿堂
    薰陶過如張忠謀等國際級企業領導者。

    「一個人每10分鐘所接觸到的日常電子產品，
    幾乎都有來自德州儀器（TI）的晶片。」

    申請資格：
    暑期實習生：大學部及碩士班在學學生（2021年或2022畢業）

    【暑期實習生相關資訊】

實習計畫五大特色

暑期實習生將可優先獲得未來畢業預聘正職機會！

實習月薪40,000起，並可參加福委會舉辦各項活動！

部門主管將根據每位實習生背景及專長設計客製化實習專案！

部門學長姊(Buddy)及HR雙導師制度助你更快融入TI大家庭！

跨部門專案建立關係並提供團隊合作實戰經驗！

電機、電子、光電等背景相關實習：

－技術行銷工程師實習 Technical Sales Engineer：https://tinyurl.com/rxdbojg

－應用工程師實習 Field Applications Engineer(FAE)：https://tinyurl.com/w5w2wqd

－產品測試工程師實習 Product Engineer：https://tinyurl.com/w7kuyb9

機械、材料、化工等背景相關實習：

－製程工程師實習 Process Engineer：https://tinyurl.com/smdg267

－封裝工程師實習 Packaging Engineer：https://tinyurl.com/wpx6kcv

－品保工程師實習 Quality Engineer：https://tinyurl.com/rr8ldyt

工業工程、工程管理等背景相關實習：

－製造部課長實習 Manufacturing Supervisor：https://tinyurl.com/wqd27pl

財務、會計、供應鏈等背景相關實習：

－財務暨營運(供應鏈)部實習 Finance, Accounting & Operations (Supply Chain)：ttps://tinyurl.com/r4txmdv

職業安全衛生、工業衛生、環醫、環衛、公衛所等背景相關實習：

－安全工程實習 ESH Specialist：https://tinyurl.com/r27yete
申請流程：

申請資料寄送 (Now-4/17) →線上影片錄製 (4/13-4/26)→線上面試 (4/23-5/15)→Offer發放 (先通過面試者先發放)

申請資料： [英文履歷]、[大學成績單]、[研究所成績單，若無可省略]、[英語檢定成績單]合併為一個PDF檔案, 寄至yurentsai@ti.com

申請信件標題：2020 你申請的職位 - 你的中文名字 （若有超過一個申請職位，請於申請信件中排序）

線上影片錄製 - 通過申請資料審核者，將收到線上影片錄製連結

‍線上面試 - 通過線上影片錄製者，將收到線上面試邀請

完整職缺請至TI 104網頁：https://tinyurl.com/rdfv8n9

如有任何申請相關問題，歡迎來信詢問！(yurentsai@ti.com）
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "15",
    text: `【力成科技股份有限公司】2020 暑期實習計畫
    力成科技為使在學生提早接觸職場，獲得理論與實務結合之機會，擬辦 2020 暑期實
習計畫。實習內容除了單位業務執行，更將實習提高至企業社會責任、個人品牌經
營、人脈建立等面向，盼透過線上先修課程修習與線下實習達成學用接軌，更讓學
生關注企業社會責任及重視個人品牌經營。
計劃說明：
1.實習對象：大三、大四及碩士在學生
2.實習期間：7/1 起，共 8-9 週
3.實習地點：新竹工業區
4.實習職類：研發、產品、製程、生管、品質、大數據分析、自動化資訊系統、資
訊(IT)、人力資源
計畫內容：
1.GOLF 線上課程先修、新鮮人夏令營
2.單位專案參與
3.實習生聚會交流、業界大師開講、讀書會
4.CSR 活動規劃與執行
5.實習成果發表會
薪資福利：
1.月薪：碩士 NTD 29,000 ; 學士 NTD 27,000
2.實習期間提供勞健保、宿舍(非設籍新竹縣市者)
報名方式：
1.報名期間：5/4 前
2.面談時間：5-6 月
    報名方式 👉 https://reurl.cc/Qd6rMZ
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "14",
    text: `雜誌、媒體暑期實習
    天下雜誌群 👉 https://web.cw.com.tw/intern/
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "13",
    text: `天下雜誌群實習計畫
    實習期間及地點

    2020/07/07~2020/09/07 ｜天下雜誌群各辦公區 (鄰近捷運松江南京站)

    申請資格 :
    ⼤三(含)以上或研究所在學學⽣，不限系所，只要你對從事媒體⼯作、媒體數位轉型有⾼度熱情，並能勇於接受未知的挑戰！

    申請⽅式 :
    即⽇起⾄4/19，請由線上表單填寫實習申請表，採先到先審制！實習雜誌別及實習職務將依個⼈志願和甄選結果予以分配。

    詳細資訊請上 天下雜誌群暑期實習網⾴ 👉 https://web.cw.com.tw/intern/
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "12",
    text: `2020 TFT 暑期實習計畫——發揮影響力的起點

    作為一個教育組織，「人才」是 TFT 最重要的資產。

    從2015年到現在，TFT的暑期實習計畫共收到超過千份的申請書，應徵者來自國內外、多元科系背景，希望透過實際參與看見社會真實的需求，也付出一己之力，成為改變的一份子。

    今年，TFT 預計招募約18-20位夥伴，在兩個月期間培養領導力、累積專案執行經驗。兩個月結束後，TFT希望邀請具潛力的人才加入執行團隊／參與TFT計畫，共同為教育平等的願景發揮正向影響力。

    【計畫內容】

    · 錄取人數｜約18-20人

    · 服務期間｜2020/7/6─8/28（每週需投入32-36小時，包含專案執行、培訓&銜接課程、組織活動等內容，實際每週服務時數，按各專案期程而定）

    · 服務地點｜TFT台北辦公室

    · 計畫保障｜團體意外險，暑期服務期間食、宿、交通的生活津貼補助（17,500元／月）

    · 服務內容｜請先參考各組別業務內容，至多可選擇申請3個志願，屆時TFT將參考您的志願和甄選結果分配至各組別

    · 晉用機會｜順利完成計畫者於兩年內申請TFT計畫，將獲得直接保送至現場面試之資格。

    【招募資訊】

    · 報名截止｜4/7

    · 書審結果通知｜4/14（通過者進行面試預約）

    · 面試｜4/18-4/24

    · 錄取通知｜5/4

    招募網頁 👉 https://pse.is/R67AP

    申請系統（建議使用電腦與google瀏覽器) 👉 https://intern.teach4taiwan.org/
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "11",
    text: `教育類暑期實習
    Teach for Taiwan 👉 https://reurl.cc/z8W3Lp
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "10",
    text: `網銀徵才
    Line Bank 👉 https://reurl.cc/L37E1X
    將來銀行 👉 https://reurl.cc/j7gAd1
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "9",
    text: `半導體暑期實習
    美光台灣 👉 http://bit.ly/MicronInternship
    台灣應用材料 👉 http://www.amtcharity.com/news.html?a=29
    力成科技 👉 https://reurl.cc/Qd6rMZ
    德州儀器 👉 https://reurl.cc/V65rpR
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "8",
    text: `半導體徵才
    ASML 👉 https://www.asml.com/en/careers
    台灣應用材料 👉 https://pse.is/QF3AY
    美光台灣 👉 http://bit.ly/micronTA
    日月光集團 👉 https://ase.aseglobal.com/ch/about/careers
    德州儀器 👉 https://reurl.cc/V65rpR
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "7",
    text: `電子支付徵才
    街口支付 👉 https://reurl.cc/nz5KVe
    Line pay 👉 https://reurl.cc/Qd6Mpq
    `,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "6",
    text: `【funP雲沛創新集團】
    funP 放MA過來 履歷投遞倒數一週！
    還沒投履歷的你，趕緊下好離手，動起來動起來🏃

    想要一腳踏入行銷奧妙的世界？
    想一窺大數據、數位行銷的龐大宇宙？
    funP第七屆儲備幹部 履歷投遞 3/31 截止
    對行銷抱有滿滿熱忱的你/妳，還在等什麼？

    立刻投遞履歷 ： https://s.tenmax.io/3IhnE
    集團官方網站：https://s.tenmax.io/9q9u7
    線上說明會【EP1. 公司&儲備幹部計畫介紹】
    🔜 https://bit.ly/2y568BR
    線上說明會【EP2. MA學長經驗分享＋廣告生態解密】
    🔜 https://bit.ly/3dvf9nO"`,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "5",
    text: `新聞媒體徵才
    三立新聞 👉 https://acts.setn.com/event/setnstyle/
    東森新聞 👉 https://www.104.com.tw/company/b6ctt6w
    公視徵才 👉 https://about.pts.org.tw/pr/career/`,
    created: new Date(2020, 2, 29)
  },
  {
    uuid: "4",
    text: `電動車徵才
    綠動未來 Green E2 👉 https://www.greene2.com/recruit
    Gogoro 👉 https://www.gogoro.com/tw/career/
  `,
    created: new Date(2020, 2, 28)
  },
  {
    uuid: "3",
    text: `【國泰人生交換所：創新軍師】\n 遊戲規則再見，我們創造自己的game\n在自由的腦力激盪中，靈感大神可以從任何地方降臨\n未來，是大家一起玩出來的\n國泰校園徵才👉 https://lihi.cc/SeWUg
  `,
    created: new Date(2020, 2, 28)
  },
  {
    uuid: "2",
    text: `美光台灣 - Micron Taiwan\n【校園尋人啟事 | 高薪懸賞錯過可惜🎁分享抽 Airpods】\n 全體注意！美光在尋找 👉 不甘平凡的菁英、熱愛科技創新的金頭腦、越戰越勇的打 Boss 人才👈
\n📍就職立馬享高薪、溝通零距離的好主管、超透明升遷管道、全球 18 國輪調機會
\n📍如果這就是你想要的，請即刻點擊連結投履歷👉 http://bit.ly/micronTA
\n📢在校生看過來！每年都搶破頭的超優質美光暑期實習計畫，目前也已經開始報名囉‼名額有限，欲報從速👉 http://bit.ly/MicronInternship
\n📢美光也將在五月份前往各校就博會👉交通大學、中央大學、台灣大學、台灣科技大學、清華大學（詳細時間以美光官網公佈為主），請持續鎖定美光新鮮人招募專區，以獲得一手消息👉 http://bit.ly/MicronFreshman
\n🎁Airpods 抽獎辦法請看留言區🎁
\n#美光台灣 #美光招募 #2020美光校園徵才`,
    created: new Date(2020, 2, 28)
  },
  {
    uuid: "1",
    text:
      "房地產徵才\n  \n 信義房屋 \n 👉 https://geni.us/HJlfGTp \n 永慶房屋 \n 👉 https://www.yungching.tw/recruitment",
    created: new Date(2020, 2, 28)
  }
];

interface PostCardProps {
  post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const classes = useStyles();
  const theme = useTheme();
  const lines = post.text.split("\n");
  const [hideText, setHideText] = useState(lines.length < 7 ? false : true);

  return (
    <div className={classes.postContainer}>
      {hideText
        ? lines.slice(0, 5).map((t, index) => (
            <div key={t + index} className={classes.text}>
              <Linkify
                properties={{
                  target: "_blank",
                  style: {
                    color: theme.palette.secondary.main,
                    textDecoration: "none"
                  }
                }}
              >
                {t}
              </Linkify>
              {index === 4 && (
                <div
                  className={classes.more}
                  onClick={() => setHideText(false)}
                >
                  {"查看更多"}
                </div>
              )}
            </div>
          ))
        : lines.map((t, index) => (
            <div key={t + index} className={classes.text}>
              <Linkify
                properties={{
                  target: "_blank",
                  style: {
                    color: theme.palette.secondary.main,
                    textDecoration: "none"
                  }
                }}
              >
                {t}
              </Linkify>
            </div>
          ))}
      <div className={classes.date}>{post.created.toLocaleDateString()}</div>
    </div>
  );
};

const JobCircle: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const [query, setQuery] = useState<string>("");

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.searchRoot}>
          <InputBase
            value={query}
            onChange={e => {
              setQuery(e.target.value);
            }}
            className={classes.input}
            placeholder="搜尋"
          />
          <IconButton className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
        </div>
        {(params.id
          ? posts.filter(p => p.uuid === params.id)
          : posts.filter(p => p.text.includes(query))
        ).map((p, index) => (
          <PostCard key={index} post={p} />
        ))}
      </div>
      {params.id && (
        <Link to={"/circle"} className={classes.circleLink}>
          {"看所有的工作圈"}
        </Link>
      )}
    </div>
  );
};

export default JobCircle;
