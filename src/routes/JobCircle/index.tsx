import { makeStyles } from "@material-ui/core";
import React from "react";
import { Header } from "components/Header";
import Linkify from "react-linkify";

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
  }
}));

const posts = [
  `美光台灣 - Micron Taiwan\n【校園尋人啟事 | 高薪懸賞錯過可惜🎁分享抽 Airpods】\n 全體注意！美光在尋找 👉 不甘平凡的菁英、熱愛科技創新的金頭腦、越戰越勇的打 Boss 人才👈
  \n📍就職立馬享高薪、溝通零距離的好主管、超透明升遷管道、全球 18 國輪調機會
  \n📍如果這就是你想要的，請即刻點擊連結投履歷👉 http://bit.ly/micronTA
  \n📢在校生看過來！每年都搶破頭的超優質美光暑期實習計畫，目前也已經開始報名囉‼名額有限，欲報從速👉 http://bit.ly/MicronInternship
  \n📢美光也將在五月份前往各校就博會👉交通大學、中央大學、台灣大學、台灣科技大學、清華大學（詳細時間以美光官網公佈為主），請持續鎖定美光新鮮人招募專區，以獲得一手消息👉 http://bit.ly/MicronFreshman
  \n🎁Airpods 抽獎辦法請看留言區🎁
  \n#美光台灣 #美光招募 #2020美光校園徵才`,
  "房地產徵才\n  \n 信義房屋 \n 👉 https://geni.us/HJlfGTp \n 永慶房屋 \n 👉 https://www.yungching.tw/recruitment"
];

interface PostProps {
  message: string;
}

const Post: React.FC<PostProps> = ({ message }) => {
  const classes = useStyles();
  return (
    <div className={classes.postContainer}>
      {message.split("\n").map((t, index) => (
        <div key={t + index} className={classes.text}>
          <Linkify className={classes.text}>{t}</Linkify>
        </div>
      ))}
    </div>
  );
};

const JobCircle: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {posts.map((p, index) => (
          <Post key={index} message={p} />
        ))}
      </div>
    </div>
  );
};

export default JobCircle;
