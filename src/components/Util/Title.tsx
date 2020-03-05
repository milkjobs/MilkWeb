import { Button, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  title: {
    display: "flex",
    alignItems: "end",
    fontSize: 24,
    fontWeight: 400,
    color: "#484848",
    textAlign: "left",
    marginRight: 16,
    flex: 1
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 12
  },
  bottomLine: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
  }
}));

interface Props {
  text?: string;
  customTextComponent?: React.ReactNode;
  buttonText?: string;
  buttonOnClick?: () => void;
  customButtonComponent?: React.ReactNode;
  hideBottomLine?: boolean;
}

const Title: React.FC<Props> = ({
  text,
  customTextComponent,
  buttonText,
  buttonOnClick,
  customButtonComponent,
  hideBottomLine
}) => {
  const classes = useStyles();

  return (
    <div
      className={`${classes.container} ${
        hideBottomLine ? "" : classes.bottomLine
      }`}
    >
      <span className={classes.title}>{text || customTextComponent}</span>
      {(buttonText && (
        <Button color="primary" onClick={buttonOnClick} variant="contained">
          {buttonText}
        </Button>
      )) ||
        customButtonComponent}
    </div>
  );
};

export { Title };
