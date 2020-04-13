import { Button, useMediaQuery } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { Title } from "components/Util";
import { checkUrl, openInNewTab, PageMetadata } from "helpers";
import React from "react";
import YouTube from "react-youtube";

interface Video {
  name: string;
  website: string;
  youtubeId: string;
}

const videoList: Video[] = [
  {
    name: "Garena 儲備幹部菁英計畫 3/8截止",
    website: "https://map.career.garena.tw/",
    youtubeId: "mxL3rECKoZg",
  },
  {
    name: "91App",
    website: "https://www.91app.com/careers/",
    youtubeId: "lZAagF7Sbp0",
  },
  {
    name: "Gogoro",
    website: "https://www.gogoro.com/tw/career/",
    youtubeId: "NeJb1dzIqEk",
  },
  {
    name: "星宇航空",
    website: "https://careers.starlux-airlines.com/",
    youtubeId: "ZDP2Nj6wHxE",
  },
  {
    name: "遠傳電信",
    website: "https://www.fetnet.net/corporate/hr/index.html",
    youtubeId: "SFjSEi9MkXM",
  },
  {
    name: "Cutaway",
    website: "https://www.cakeresume.com/companies/cutawaytw",
    youtubeId: "LA5VnFHFB2E",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px",
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 32,
    marginTop: 16,
    [theme.breakpoints.up("md")]: {
      width: 640,
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
      marginTop: 0,
    },
  },
  nameContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
  },
  title: {
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
    fontWeight: "bold",
  },
  video: {
    width: "100%",
  },
}));

const VideoCard: React.FC<Video> = (props) => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const opts = matched
    ? {}
    : {
        height: "360",
        width: "640",
      };

  return (
    <div className={classes.cardContainer}>
      <YouTube
        containerClassName={classes.video}
        className={classes.video}
        videoId={props.youtubeId}
        opts={opts}
      />
      <div className={classes.nameContainer}>
        <div className={classes.title}>{props.name}</div>
        <Button
          style={{ minWidth: 100, marginLeft: 8 }}
          variant="contained"
          color="secondary"
          onClick={() => openInNewTab(checkUrl(props.website))}
        >
          前往應徵
        </Button>
      </div>
    </div>
  );
};

const Stories: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageMetadata title="故事－牛奶找工作" />
      <Header />
      <div className={classes.container}>
        <Title text="故事" />
        {videoList.map((v) => (
          <VideoCard {...v} key={v.youtubeId} />
        ))}
      </div>
    </div>
  );
};

export default Stories;
