import { Bottle as BottleType } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import LightThemeBottle from "assets/icons/bottle_light.png";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    position: "relative",
    padding: 24
  },
  highlight: {
    color: theme.palette.secondary.main
  },
  image: {
    // original size 1203x472
    height: 200,
    resizeMode: "contain",
    width: 78.47 // 200 / 1203 * 472
  },
  replyCount: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 40
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
    justifyContent: "center"
  },
  text: {
    borderBottomWidth: 4,
    borderBottomColor: "black",
    borderTopColor: "black",
    borderTopWidth: 4,
    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    width: 75,
    padding: 8,
    fontSize: 18,
    marginTop: 40
  },
  mytext: {
    borderBottomWidth: 4,
    borderBottomColor: "black",
    borderTopColor: "black",
    borderTopWidth: 4,
    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    width: 75,
    padding: 8,
    fontSize: 18,
    marginTop: 40,
    color: theme.palette.secondary.main
  }
}));

interface Props {
  bottle: BottleType;
  myBottle: boolean;
}

const Bottle: React.FC<Props> = ({ bottle, myBottle }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img src={LightThemeBottle} className={classes.image} />
      <div className={classes.tag}>
        <div className={myBottle ? classes.mytext : classes.text}>
          {bottle.message.slice(0, 2).replace(/(\n|\s)/, "")}
        </div>
      </div>
    </div>
  );
};

export { Bottle };
