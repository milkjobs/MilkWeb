import { DetailedAddress } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      paddingLeft: 0,
      paddingRight: 0,
    },
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
      marginBottom: 4,
    },
  },
  location: {
    alignItems: "center",
    color: theme.palette.text.primary,
    display: "flex",
    flex: 1,
    fontSize: 16,
    justifyContent: "center",
    marginBottom: 16,
    marginRight: "auto",
    wordBreak: "break-all",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  mapLink: {
    marginLeft: 16,
    color: theme.palette.secondary.main,
    cursor: "pointer",
    wordBreak: "keep-all",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
}));

interface Props {
  address: DetailedAddress;
}

const JobLocation: React.FC<Props> = (props) => {
  const { address } = props;
  const classes = useStyles();
  const fullAddress = address.area + address.subArea + address.street;

  return (
    <div className={classes.container}>
      <div className={classes.title}>地點</div>
      <div className={classes.location}>
        {fullAddress}
        <div
          className={classes.mapLink}
          onClick={() => {
            window.open(
              `https://www.google.com.tw/maps/search/${fullAddress}`,
              "_blank"
            );
          }}
        >
          查看地圖
        </div>
      </div>
    </div>
  );
};

export { JobLocation };
