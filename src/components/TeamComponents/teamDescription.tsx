import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 24,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        marginTop: 0,
        paddingBottom: 0,
      },
    },
    title: {
      display: "flex",
      flex: 1,
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 8,
      color: theme.palette.text.primary,
      [theme.breakpoints.down("xs")]: {
        fontSize: 16,
        marginBottom: 4,
      },
    },
    description: {
      display: "flex",
      flexDirection: "column",
      fontSize: 16,
      color: theme.palette.text.primary,
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        fontSize: 14,
      },
    },
    line: {
      marginTop: 4,
      marginBottom: 4,
      [theme.breakpoints.down("xs")]: {
        marginTop: 2,
        marginBottom: 2,
      },
    },
  });
interface Props extends WithStyles<typeof styles> {
  introduction?: string;
}

const TeamDescription: React.FC<Props> = (props) => {
  const { classes, introduction } = props;
  return (
    <div className={classes.container}>
      <div className={classes.title}>介紹</div>
      <div className={classes.description}>
        {introduction && introduction.trim().length
          ? introduction.split("\n").map((item, i) => {
              return (
                <p className={classes.line} key={i}>
                  {item}
                </p>
              );
            })
          : "尚無介紹"}
      </div>
    </div>
  );
};

export default withStyles(styles)(TeamDescription);
