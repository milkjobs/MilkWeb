import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        marginTop: 0,
        paddingBottom: 0
      }
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
        marginBottom: 4
      }
    },
    description: {
      display: "flex",
      flexDirection: "row",
      fontSize: 16,
      color: theme.palette.text.primary,
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        fontSize: 14
      }
    },
    line: {
      marginTop: 4,
      marginBottom: 4,
      [theme.breakpoints.down("xs")]: {
        marginTop: 2,
        marginBottom: 2
      }
    }
  });
interface Props extends WithStyles<typeof styles> {
  unifiedNumber: string;
  name: string;
}

const TeamOfficialInfo: React.FC<Props> = props => {
  const { classes, unifiedNumber, name } = props;
  return (
    <div className={classes.container}>
      <div className={classes.title}>工商信息</div>
      {unifiedNumber && (
        <div className={classes.description}>
          <div>公司統編</div>
          <div style={{ marginLeft: "auto" }}>{unifiedNumber}</div>
        </div>
      )}
      {name && (
        <div className={classes.description}>
          <div style={{ flex: 1 }}>公司全稱</div>
          <div
            style={{
              flex: 2,
              marginLeft: "auto",
              textAlign: "right"
            }}
          >
            {name}
          </div>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(TeamOfficialInfo);
