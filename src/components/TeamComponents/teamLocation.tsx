import { DetailedAddress } from "@frankyjuang/milkapi-client";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { openInNewTab } from "helpers";
import React from "react";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 16,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        marginTop: 0
      }
    },
    title: {
      flex: 1,
      marginRight: "auto",
      fontWeight: 600,
      fontSize: 18,
      color: theme.palette.text.primary,
      marginBottom: 8,
      [theme.breakpoints.down("xs")]: {
        fontSize: 16,
        marginBottom: 4
      }
    },
    location: {
      display: "flex",
      flex: 1,
      fontSize: 16,
      color: theme.palette.text.primary,
      marginRight: "auto",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      [theme.breakpoints.down("xs")]: {
        fontSize: 14
      }
    },
    mapLink: {
      marginLeft: 16,
      color: theme.palette.secondary.main,
      [theme.breakpoints.down("xs")]: {
        fontSize: 14
      },
      cursor: "pointer"
    }
  });

interface Props extends WithStyles<typeof styles> {
  address: DetailedAddress;
}

const TeamLocation: React.FC<Props> = props => {
  const { classes, address } = props;
  return (
    <div className={classes.container}>
      <div className={classes.title}>地點</div>
      <div className={classes.location}>
        {address.area + address.subArea + address.street}
        <div
          className={classes.mapLink}
          onClick={() => {
            openInNewTab(
              `https://www.google.com.tw/maps/search/${address.area +
                address.subArea +
                address.street}/`
            );
          }}
        >
          {"查看地圖"}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(TeamLocation);
