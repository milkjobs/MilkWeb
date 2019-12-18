import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import YouTube from "react-youtube";
import { DownloadAppDialog } from "components/Util";

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
      width: "100%",
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
    justifyContent: "space-around",
    alignItems: "center"
  },
  icon: {
    width: 40,
    height: 40
  },
  app: {
    fontSize: 24,
    cursor: "pointer"
  }
}));

const About: React.FC = () => {
  const match = useRouteMatch();
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showDownloadAppDialog = () => {
    setIsDialogOpen(true);
  };

  const hideDownloadAppDialog = () => {
    setIsDialogOpen(false);
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  return (
    match && (
      <div className={classes.root}>
        <Header />
        <div className={classes.container}>
          <img
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1u12Nu1cqNDGNA3kvGjWswQpcURhsOpgb"
            }
          />
          <img
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1RKPOeLNcjrvjZlBDvYJWcZ4P5M-EZHY6"
            }
          />
          <img
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1Ob26YmtEofkV1Dclkxz0Xz_EtEFiGRQW"
            }
          />
          <img
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1GxwhZ5eIHnM3flMPgv6okxtJ0yjD4oPB"
            }
          />
          <div className={classes.iconsContainer}>
            <div className={classes.app} onClick={showDownloadAppDialog}>
              App
            </div>
            <a href={"https://fb.me/themilkjobs"}>
              <img
                className={classes.icon}
                src={"https://image.flaticon.com/icons/png/512/174/174848.png"}
                alt={"FB"}
              />
            </a>
            <a href={"https://instagr.am/milkjobs"}>
              <img
                className={classes.icon}
                src={
                  "https://image.flaticon.com/icons/png/512/2111/2111463.png"
                }
                alt={"IG"}
              />
            </a>
            <a
              href={"https://www.youtube.com/channel/UClQbsw6sZhwIrctTUFrx7Og"}
            >
              <img
                className={classes.icon}
                src={"https://image.flaticon.com/icons/png/512/174/174883.png"}
                alt={"Youtube"}
              />
            </a>
          </div>
          {/* <YouTube videoId="T_sZkl-O7Ck" opts={opts} /> */}
        </div>
        <DownloadAppDialog
          isOpen={isDialogOpen}
          close={hideDownloadAppDialog}
        />
      </div>
    )
  );
};

export default About;
