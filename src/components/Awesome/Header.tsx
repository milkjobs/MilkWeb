import { Button, makeStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { awesomes, AwesomeEntry } from "./awesomes";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  link: {
    textDecoration: "none"
  }
}));

interface Props {
  containerStyle?: React.CSSProperties;
}

const AwesomeHeader: React.FC<Props> = ({ containerStyle }) => {
  const classes = useStyles();
  const [lists] = useState<AwesomeEntry[]>(_.sampleSize(awesomes, 9));

  return (
    <div className={classes.container} style={containerStyle}>
      <Link to={{ pathname: "/departments" }} className={classes.link}>
        <Button>就業精選</Button>
      </Link>
      {lists.map(list => (
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
      </Link>
      <div style={{ flex: 1 }}></div>
    </div>
  );
};

export { AwesomeHeader };
