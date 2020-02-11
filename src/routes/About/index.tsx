import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import { DownloadAppDialog } from "components/Util";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";

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
      width: 900,
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

  return (
    match && (
      <div className={classes.root}>
        <Header />
        <div className={classes.container}>
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1U9kokrW01T8JksoDAQN21-k80oo_9TWy"
            }
          />
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1eSOHvfUXxbBoA1ACMOOMUsEizTaIEXh6"
            }
          />
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1HQ2bPvx1AYxMDTN-VaSggevaIjIzFyRL"
            }
          />
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1CcUcfR7MZvvnljcSYKWepkEgenj-4cKk"
            }
          />
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1aztEr5KR3VZSqjvUnWYsKr_2iZksEQtz"
            }
          />
          <img
            alt="app"
            className={classes.appImage}
            src={
              "https://drive.google.com/uc?id=1dYAVCZgh_xarMMbHi3CY9iZHrAoA1ytf"
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
