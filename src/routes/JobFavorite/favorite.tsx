import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React, { Component } from "react";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 24,
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      paddingRight: 24,
      paddingLeft: 24,
      flexDirection: "column",
      justifyContent: "center",
      [theme.breakpoints.up("md")]: {
        width: "860px"
      }
    },
    title: {
      display: "flex",
      alignItems: "center",
      fontSize: 24,
      fontWeight: 400,
      color: "#484848"
    },
    titleContainer: {
      display: "flex",
      marginBottom: 12,
      paddingRight: 24,
      paddingLeft: 24
    }
  });

export interface Props extends WithStyles<typeof styles> {}

class Favorite extends Component<Props> {
  render() {
    const { classes } = this.props;
    return <div className={classes.container} />;
  }
}

export default withStyles(styles)(Favorite);
