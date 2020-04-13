import { Team } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { TeamSizeConvertor } from "helpers";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "column",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
  },
  name: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    color: theme.palette.text.primary,
    marginRight: "auto",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    },
  },
  detail: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    color: theme.palette.text.primary,
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  description: {
    display: "flex",
    fontSize: 14,
    color: "#9B9B9B",
    textAlign: "left",
  },
  logoContainer: {
    objectFit: "contain",
    marginRight: 16,
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      width: 40,
      height: 40,
    },
  },
}));

const TeamInfo: React.FC<Team> = (props) => {
  const {
    nickname,
    size,
    address,
    primaryField,
    secondaryField,
    logoUrl,
  } = props;
  const classes = useStyles();

  let fieldsWords = primaryField;
  if (secondaryField) {
    fieldsWords = fieldsWords + "・" + secondaryField;
  }

  return (
    <div className={classes.container}>
      <div style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}>
        <img alt="team logo" className={classes.logoContainer} src={logoUrl} />
        <div className={classes.nameContainer}>
          <div className={classes.name}>{nickname}</div>
          <div className={classes.detail}>
            {address.area +
              address.subArea +
              "・" +
              fieldsWords +
              "・" +
              TeamSizeConvertor(size)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;
