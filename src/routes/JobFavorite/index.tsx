import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Header } from "components/Header";
import Favorite from "./favorite";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      backgroundColor: theme.palette.background.paper
    },
    container: {
      marginTop: 8,
      marginLeft: 24,
      marginRight: 24,
      marginBottom: 30,
      display: "flex",
      flexGrow: 1,
      alignContent: "stretch",
      justifyContent: "center",
      flexDirection: "row",
      [theme.breakpoints.up("sm")]: {
        marginLeft: 54,
        marginRight: 24
      }
    },
    subHeader: {
      flexDirection: "row",
      display: "flex",
      height: 72,
      justifyContent: "center",
      alignItems: "center"
    },
    navButton: {
      fontSize: 16,
      paddingRight: 24,
      paddingLeft: 24,
      fontWeight: 400,
      backgroundColor: "white",
      marginRight: 12,
      marginLeft: 12
    }
  });

export interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

const JobFavorite: React.FC<Props> = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <Favorite />
      </div>
    </div>
  );
};

export default withStyles(styles)(withRouter(JobFavorite));
