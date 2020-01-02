import { makeStyles, Theme } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import qs from "qs";
import { Link, useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { openInNewTab, checkUrl } from "helpers";
import { useMediaQuery } from "@material-ui/core";
import { useAuth } from "stores";
import { AwesomeList } from "@frankyjuang/milkapi-client";

interface Company {
  name: string;
  logoUrl: string;
  website: string;
  headcount?: number;
  revenue?: number;
  introduction: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  },
  header: {
    fontSize: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    },
    fontWeight: 800
  },
  companyCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      padding: 8
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper
  },
  nameContainer: {
    display: "flex",
    marginLeft: 16,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    },
    flexDirection: "column"
  },
  logo: {
    maxWidth: 100,
    height: 100,
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
    color: theme.palette.text.secondary,
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

const CompanyCard: React.FC<Company> = props => {
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

  return (
    <div
      className={classes.companyCardContainer}
      onClick={() => openInNewTab(checkUrl(props.website))}
    >
      {!matched && <img src={props.logoUrl} className={classes.logo} />}
      <div className={classes.nameContainer}>
        <div className={classes.iconContainer}>
          {matched && <img src={props.logoUrl} className={classes.logo} />}
          <div>
            <div className={classes.title}>{props.name}</div>
            <div className={classes.info}>
              {`${props.headcount ? sizeToWord(props.headcount) : ""}   ${
                props.revenue ? incomeToWord(props.revenue) : ""
              }`}
            </div>
          </div>
        </div>
        <div className={classes.description}>{props.introduction}</div>
      </div>
    </div>
  );
};

const JobSearch: React.FC = () => {
  const { getApi } = useAuth();
  const location = useLocation();
  const classes = useStyles();
  const [awesomeList, setAwesomeList] = useState<AwesomeList[]>();

  const getAwesomeList = async (name: string) => {
    const awesomeApi = await getApi("Awesome");
    const list = await awesomeApi.getAwesomeLists({ name });
    setAwesomeList(list);
  };

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    if ("major" in params) {
      if (params.major === "ee") getAwesomeList("台大電機");
      if (params.major === "cs") getAwesomeList("台大資工");
    } else getAwesomeList("台大電機");
  }, [location.search]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <Link
            to={{ pathname: "/ntu", search: "?major=ee" }}
            className={classes.majorButton}
          >
            <Button>台大電機</Button>
          </Link>
          <Link
            to={{ pathname: "/ntu", search: "?major=cs" }}
            className={classes.majorButton}
          >
            <Button>台大資工</Button>
          </Link>
        </div>
        {awesomeList && (
          <div className={classes.header}>
            精選{awesomeList[0].name}
            畢業生，最常去的公司。先從這些公司開始應徵吧!
          </div>
        )}
        {awesomeList &&
          awesomeList.length > 0 &&
          awesomeList[0].teams &&
          awesomeList[0].teams.map(c => <CompanyCard key={c.name} {...c} />)}
      </div>
    </div>
  );
};

export default JobSearch;
