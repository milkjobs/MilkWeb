import { makeStyles } from "@material-ui/core";
import missingMilkImage from "assets/missing.png";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  container: {
    display: "flex",
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 60,
    marginBottom: 60,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px",
      paddingRight: 0,
      paddingLeft: 0,
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: 30,
    },
  },
  descriptionContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  descriptionHeader: {
    display: "flex",
    fontSize: 120,
    fontWeight: 800,
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 72,
    },
  },
  descriptionSubheader: {
    display: "flex",
    fontSize: 30,
    alignItems: "center",
    textAlign: "left",
  },
  descriptionBody: {
    display: "flex",
    fontSize: 20,
    marginTop: 16,
    marginBottom: 16,
    textAlign: "left",
  },
  descriptionFooter: {
    display: "flex",
    flex: 1,
    alignItems: "flex-end",
    fontSize: 20,
  },
  imageContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  image: {
    maxWidth: "100%",
  },
  link: {
    textDecoration: "none",
    color: "#484848",
    display: "flex",
  },
}));

interface Props {
  subheader: string;
  description: string;
}

const ErrorStatus: React.FC<Props> = (props) => {
  const { subheader, description } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.descriptionContainer}>
        <div className={classes.descriptionHeader}>糟糕！</div>
        <div className={classes.descriptionSubheader}>{subheader}</div>
        <div className={classes.descriptionBody}>{description}</div>
        <div className={classes.descriptionFooter}>
          <Link to="/" className={classes.link}>
            回到首頁
          </Link>
        </div>
      </div>
      <div className={classes.imageContainer}>
        <img
          alt="milk missing"
          src={missingMilkImage}
          className={classes.image}
        />
      </div>
    </div>
  );
};

export { ErrorStatus };
