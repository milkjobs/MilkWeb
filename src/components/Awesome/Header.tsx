import { Button, makeStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { awesomes, AwesomeEntry } from "./awesomes";

const useStyles = makeStyles(() => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
  },
}));

interface Props {
  containerStyle?: React.CSSProperties;
}

const AwesomeHeader: React.FC<Props> = ({ containerStyle }) => {
  const classes = useStyles();
  const [lists] = useState<AwesomeEntry[]>(_.sampleSize(awesomes, 5));

  return (
    <div className={classes.container} style={containerStyle}>
      <Link
        to={{ pathname: "/circle/988101058c344b3696ce00665bfa5e14" }}
        className={classes.link}
      >
        <Button>校園徵才</Button>
      </Link>
      <Link
        to={{ pathname: "/circle/c8fdcda43d37476a91062950452efb4f" }}
        className={classes.link}
      >
        <Button>實習資訊</Button>
      </Link>
      <Link to={{ pathname: "/qna" }} className={classes.link}>
        <Button>職場問答</Button>
      </Link>
      <a href={"https://covid19.milk.jobs/"} className={classes.link}>
        <Button>新冠肺炎，公司招募情形</Button>
      </a>
      {/* {lists.map((list) => (
        <Link
          key={list.link}
          to={{ pathname: `/awesome/${list.link}` }}
          className={classes.link}
        >
          <Button>{list.name}</Button>
        </Link>
      ))}
      <Link to={{ pathname: "/departments" }} className={classes.link}>
        <Button>看更多</Button>
      </Link> */}
      <div style={{ flex: 1 }}></div>
    </div>
  );
};

export { AwesomeHeader };
