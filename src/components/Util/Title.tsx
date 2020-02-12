import { Button, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  title: {
    display: "flex",
    alignItems: "end",
    fontSize: 24,
    fontWeight: 400,
    color: "#484848"
  },
  container: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 12
  }
}));

interface Props {
  text: string;
  buttonText: string;
  buttonOnClick: () => void;
}

const Title: React.FC<Props> = ({ text, buttonText, buttonOnClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <span className={classes.title}>{text}</span>
      <Button color="primary" onClick={buttonOnClick} variant="contained">
        {buttonText}
      </Button>
    </div>
  );
};

export { Title };
