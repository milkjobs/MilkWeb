import { AwesomeTeam } from "@frankyjuang/milkapi-client";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { checkUrl, openInNewTab } from "helpers";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "row",
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("xs")]: {
      padding: 12
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2) !important"
    }
  },
  nameContainer: {
    display: "flex",
    marginLeft: 16,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    },
    flexDirection: "column",
    flex: 1
  },
  logo: {
    width: 100,
    maxHeight: 100,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 40,
      height: 40
    },
    margin: 16,
    objectFit: "contain"
  },
  title: {
    fontSize: 24,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8
    }
  },
  info: {
    fontSize: 16,
    color: theme.palette.text.hint,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8
    }
  },
  description: {
    marginTop: 16,
    fontSize: 18,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginTop: 0
    },
    textAlign: "left"
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

const CompanyCard: React.FC<AwesomeTeam> = props => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const sizeToWord = (size: number) => {
    if (size >= 10000) return ` ${size / 10000} 萬人`;
    else return ` ${size} 人`;
  };

  const incomeToWord = (income: number) => {
    if (income >= 10000) return `營收約 ${income / 10000} 兆新台幣`;
    else return `營收約 ${income} 億新台幣`;
  };

  const linkedinCountToWord = (count: number) => {
    return `統計: ${count} 人`;
  };

  return (
    <div
      className={classes.container}
      onClick={() => openInNewTab(checkUrl(props.website))}
    >
      {!matched && (
        <img alt="team logo" src={props.logoUrl} className={classes.logo} />
      )}
      <div className={classes.nameContainer}>
        <div className={classes.iconContainer}>
          {matched && (
            <img alt="team logo" src={props.logoUrl} className={classes.logo} />
          )}
          <div>
            <div className={classes.title}>{props.name}</div>
            <div className={classes.info}>
              {`${props.field ? props.field : ""} ${
                props.headcount ? sizeToWord(props.headcount) : ""
              }   ${
                props.revenue && !matched ? incomeToWord(props.revenue) : ""
              }   ${
                props.linkedinCount
                  ? linkedinCountToWord(props.linkedinCount)
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={classes.description}>{props.introduction}</div>
      </div>
    </div>
  );
};

export { CompanyCard };
