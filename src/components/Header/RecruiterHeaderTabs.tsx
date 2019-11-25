import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none",
    color: "#484848",
    display: "flex"
  },
  tab: {
    marginLeft: 30,
    display: "flex",
    height: "auto",
    alignItems: "center",
    color: "#484848",
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.secondary.main
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      alignSelf: "stretch"
    }
  },
  avatar: {
    width: 30,
    height: 30,
    boxShadow: "0 4px 4px rgba(0,0,0,0.1) !important"
  }
}));

interface Props {
  openExploreMenu: (event: MouseEvent<HTMLElement>) => void;
  openProfileMenu: (event: MouseEvent<HTMLElement>) => void;
}
const RecruiterHeaderTabs: React.FC<Props> = props => {
  const { openProfileMenu } = props;
  const classes = useStyles();
  const { user } = useAuth();
  const location = useLocation();
  const isRecruiterHome = location.pathname === "/recruiter";

  return (
    <div className={classes.sectionDesktop}>
      {!isRecruiterHome && (
        <Link
          to="/recruiter"
          style={{
            textDecoration: "none",
            color: "#484848",
            display: "flex"
          }}
        >
          <span className={classes.tab}>職缺管理</span>
        </Link>
      )}
      <Link to={"/message"} className={classes.link}>
        <span className={classes.tab}>訊息</span>
      </Link>

      {user && (
        <span
          className={classes.tab}
          aria-owns={"material-appbar"}
          aria-haspopup="true"
          onClick={openProfileMenu}
        >
          <Avatar className={classes.avatar} src={user.profileImageUrl} />
        </span>
      )}
    </div>
  );
};

export { RecruiterHeaderTabs };
