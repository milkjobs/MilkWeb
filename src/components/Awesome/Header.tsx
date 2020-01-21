import { Button, makeStyles, Theme, useMediaQuery } from "@material-ui/core";
import { openInNewTab } from "helpers";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  }
}));

interface Props {
  showStories?: boolean;
  showChatRoom?: boolean;
}

const AwesomeHeader: React.FC<Props> = ({ showStories, showChatRoom }) => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  return (
    <div className={classes.schoolContainer}>
      {showStories ? (
        <Link to={{ pathname: "/stories" }} className={classes.majorButton}>
          <Button>故事</Button>
        </Link>
      ) : (
        <div className={classes.schoolTitle}>就業精選</div>
      )}
      <Link
        to={{ pathname: "/awesome/台大電機" }}
        className={classes.majorButton}
      >
        <Button>台大電機</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大資工" }}
        className={classes.majorButton}
      >
        <Button>台大資工</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大財金" }}
        className={classes.majorButton}
      >
        <Button>台大財金</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大國企" }}
        className={classes.majorButton}
      >
        <Button>台大國企</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大工管" }}
        className={classes.majorButton}
      >
        <Button>台大工管</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大化工" }}
        className={classes.majorButton}
      >
        <Button>台大化工</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大機械" }}
        className={classes.majorButton}
      >
        <Button>台大機械</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大公衛" }}
        className={classes.majorButton}
      >
        <Button>台大公衛</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大藥學" }}
        className={classes.majorButton}
      >
        <Button>台大藥學</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大圖資" }}
        className={classes.majorButton}
      >
        <Button>台大圖資</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大數學" }}
        className={classes.majorButton}
      >
        <Button>台大數學</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大物理" }}
        className={classes.majorButton}
      >
        <Button>台大物理</Button>
      </Link>
      <Link
        to={{ pathname: "/awesome/台大經濟" }}
        className={classes.majorButton}
      >
        <Button>台大經濟</Button>
      </Link>
      <Link to={{ pathname: "/awesome/電商" }} className={classes.majorButton}>
        <Button>電商</Button>
      </Link>
      <Link to={{ pathname: "/awesome/遊戲" }} className={classes.majorButton}>
        <Button>遊戲</Button>
      </Link>
      {showChatRoom && matched && (
        <div
          onClick={() => openInNewTab("https://tlk.io/ntu")}
          className={classes.majorButton}
        >
          <Button>找工作聊天室</Button>
        </div>
      )}
    </div>
  );
};

export { AwesomeHeader };
