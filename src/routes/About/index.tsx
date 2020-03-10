import { makeStyles } from "@material-ui/core";
import { Dark, Download, Job, Manage, Slogan } from "assets/about";
import {
  AppStore,
  Facebook,
  GooglePlay,
  Instagram,
  Youtube
} from "assets/icons";
import { Header } from "components/Header";
import { PageMetadata } from "helpers";
import React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    marginTop: 8,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 30,
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      width: 960,
      marginRight: "auto",
      marginLeft: "auto"
    }
  },
  appImage: {
    width: "100%"
  },
  iconsContainer: {
    display: "flex",
    marginTop: 60,
    marginBottom: 100,
    width: 640,
    padding: 40,
    justifyContent: "space-between",
    alignItems: "center"
  },
  app: {
    fontSize: 24,
    cursor: "pointer"
  }
}));

const About: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageMetadata title="關於我們－牛奶找工作" />
      <Header />
      <div className={classes.container}>
        <img alt="app" className={classes.appImage} src={Manage} />
        <img alt="app" className={classes.appImage} src={Job} />
        <img alt="app" className={classes.appImage} src={Download} />
        {/* <img alt="app" className={classes.appImage} src={Dark} /> */}
        {/* <img alt="app" className={classes.appImage} src={Slogan} /> */}
        {/* <img alt="app" className={classes.appImage} src={Chat} /> */}
        <div className={classes.iconsContainer}>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://apps.apple.com/tw/app/id1480033474"
          >
            <img style={{ height: 40 }} src={AppStore} alt="app-store" />
          </a>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.milkjobs.app"
          >
            <img style={{ height: 60 }} src={GooglePlay} alt="google-play" />
          </a>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.facebook.com/themilkjobs"
          >
            <img style={{ height: 40 }} src={Facebook} alt="facebook" />
          </a>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.instagram.com/milkjobs/"
          >
            <img style={{ height: 40 }} src={Instagram} alt="instagram" />
          </a>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.youtube.com/channel/UClQbsw6sZhwIrctTUFrx7Og"
          >
            <img style={{ height: 48 }} src={Youtube} alt="youtube" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
