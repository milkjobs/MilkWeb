import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { awesomes, AwesomeEntry } from "./awesomes";
import SchoolIcon from "@material-ui/icons/School";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import BugReportIcon from "@material-ui/icons/BugReport";
import ListAltIcon from "@material-ui/icons/ListAlt";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  link: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  imgContainer: {
    flex: 1,
    position: "relative",
    textAlign: "center",
    color: "white",
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  img: {
    width: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: 8,
  },
  imgTitle: {
    position: "absolute",
    fontSize: 24,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

interface ImageCoverProps {
  imgUrl: any;
  title: string;
}

const ImageCover: React.FC<ImageCoverProps> = ({ imgUrl, title }) => {
  const classes = useStyles();
  return (
    <div className={classes.imgContainer}>
      <img src={imgUrl} className={classes.img} />
      <div className={classes.imgTitle}>{title}</div>
    </div>
  );
};

interface Props {
  containerStyle?: React.CSSProperties;
}

const AwesomeHeader: React.FC<Props> = ({ containerStyle }) => {
  const classes = useStyles();
  const [lists] = useState<AwesomeEntry[]>(_.sampleSize(awesomes, 5));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.container} style={containerStyle}>
      <Link
        to={{ pathname: "/circle/760ab9a67eef4187aa0bc8d9b07a5c84" }}
        className={classes.link}
      >
        <MonetizationOnIcon />
        <div style={{ marginLeft: 8, fontSize: 16 }}>{"錢途找工作"}</div>
      </Link>
      <Link
        to={{ pathname: "/circle/988101058c344b3696ce00665bfa5e14" }}
        className={classes.link}
      >
        <SchoolIcon />
        <div style={{ marginLeft: 8, fontSize: 16 }}>{"校園徵才"}</div>
      </Link>
      <Link
        to={{ pathname: "/circle/c8fdcda43d37476a91062950452efb4f" }}
        className={classes.link}
      >
        <MenuBookIcon />
        <div style={{ marginLeft: 8, fontSize: 16 }}>{"實習資訊"}</div>
      </Link>
      {!isMobile && (
        <>
          <Link to={{ pathname: "/qna" }} className={classes.link}>
            <LiveHelpIcon />
            <div style={{ marginLeft: 8, fontSize: 16 }}>{"職場問答"}</div>
          </Link>
          <Link to={{ pathname: "/departments" }} className={classes.link}>
            <ListAltIcon />
            <div style={{ marginLeft: 8, fontSize: 16 }}>{"就業精選"}</div>
          </Link>
          <a href={"https://covid19.milk.jobs/"} className={classes.link}>
            <BugReportIcon />
            <div style={{ marginLeft: 8, fontSize: 16 }}>
              <div>疫情期間</div>
              <div>公司招募回報</div>
            </div>
          </a>
        </>
      )}
      {/* {lists.map((list) => (
        <Link
          key={list.link}
          to={{ pathname: `/awesome/${list.link}` }}
          className={classes.link}
        >
          <Button>{list.name}</Button>
        </Link>
      ))}
      <Link to={{ pathname: "/departments" }} className={classes.link}>
        <Button>看更多</Button>
      </Link> */}
    </div>
  );
};

export { AwesomeHeader };
