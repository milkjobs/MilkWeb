import { makeStyles, Theme } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { openInNewTab, checkUrl } from "helpers";
import { Button, useMediaQuery } from "@material-ui/core";

interface Video {
  name: string;
  website: string;
  youtubeId: string;
}

const videoList: Video[] = [
  {
    name: "Garena 儲備幹部菁英計畫 3/8截止",
    website: "https://map.career.garena.tw/",
    youtubeId: "mxL3rECKoZg"
  },
  {
    name: "91App",
    website: "https://www.91app.com/careers/",
    youtubeId: "lZAagF7Sbp0"
  },
  {
    name: "蝦皮 儲備幹部 1/31截止",
    website: "https://careers.shopee.tw/GLP",
    youtubeId: "BGCIQ2UgYho"
  },
  {
    name: "Gogoro",
    website: "https://www.gogoro.com/tw/career/",
    youtubeId: "NeJb1dzIqEk"
  },
  {
    name: "星宇航空",
    website: "https://careers.starlux-airlines.com/",
    youtubeId: "ZDP2Nj6wHxE"
  },
  {
    name: "Cutaway",
    website: "https://www.cakeresume.com/companies/cutawaytw",
    youtubeId: "LA5VnFHFB2E"
  }
];

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
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "640px"
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 32,
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 16
    }
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
    borderBottomColor: theme.palette.divider
  },
  title: {
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    },
    fontWeight: "bold"
  },
  video: {
    width: "100%"
  }
}));

const VideoCard: React.FC<Video> = props => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));
  const opts = matched
    ? {}
    : {
        height: "390",
        width: "640"
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
      <Header />
      <div className={classes.container}>
        {videoList.map(v => (
          <VideoCard {...v} key={v.youtubeId} />
        ))}
      </div>
    </div>
  );
};

export default Stories;
