import { Bottle as BottleType } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import LightThemeBottle from "assets/icons/bottle_light.png";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    padding: 24,
  },
  highlight: {
    color: theme.palette.secondary.main,
  },
  image: {
    // original size 1203x472
    height: 200,
    opacity: 0.2,
    resizeMode: "contain",
    width: 78.47, // 200 / 1203 * 472
  },
  replyCount: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 40,
  },
  tag: {
    height: "100%",
    top: 0,
    bottom: 0,
    left: 0,
    position: "absolute",
    textAlign: "center",
    verticalAlign: "center",
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    opacity: 0.2,
    width: 75,
    padding: 8,
    fontSize: 48,
    marginTop: 40,
  },
}));

const PlusBottle: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img src={LightThemeBottle} className={classes.image} />
      <div className={classes.tag}>
        <div className={classes.text}>+</div>
      </div>
    </div>
  );
};

export { PlusBottle };
