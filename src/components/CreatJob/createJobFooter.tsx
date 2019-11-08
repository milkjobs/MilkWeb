import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

const CreateJobFooter: React.FC<Props> = props => {
  const { classes, nextClick = () => {}, nextText, history } = props;
  return (
    <>
      <Button className={classes.back} onClick={() => history.goBack()}>
        <KeyboardArrowLeft />
        <div>返回</div>
      </Button>
      <Button
        onClick={() => {
          nextClick();
        }}
        color="primary"
        variant="contained"
        className={classes.nextStep}
      >
        <div>{nextText}</div>
      </Button>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    back: {
      width: 100,
      height: 44,
      display: "flex",
      marginRight: "auto",
      marginTop: 16,
      border: 0,
      color: "#69C0FF",
      fontWeight: "bold",
      fontSize: 16
    },
    nextStep: {
      display: "flex",
      textDecoration: "none",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      width: 100,
      height: 44,
      borderRadius: 4,
      marginLeft: "auto",
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      boxShadow: "none"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextText: string;
  nextClick?: () => void;
}

export default withStyles(styles)(withRouter(CreateJobFooter));
