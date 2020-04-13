import { LinearProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Dehaze, Search, Apps } from "@material-ui/icons";
import logo from "assets/milk.png";
import qs from "qs";
import React, { useState } from "react";
import Headroom from "react-headroom";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ApplicantExploreMenu } from "./ApplicantExploreMenu";
import { ApplicantHeaderTabs } from "./ApplicantHeaderTabs";
import { ApplicantProfileMenu } from "./ApplicantProfileMenu";
import { RecruiterExploreMenu } from "./RecruiterExploreMenu";
import { RecruiterHeaderTabs } from "./RecruiterHeaderTabs";
import { RecruiterProfileMenu } from "./RecruiterProfileMenu";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "#484848",
    display: "flex",
  },
  tab: {
    marginLeft: 30,
    display: "flex",
    height: "auto",
    alignItems: "center",
    color: theme.palette.text.primary,
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  root: {
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  appBarRoot: {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0 0px 0px rgba(0,0,0,0.05) !important",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logo: {
    display: "flex",
  },
  search: {
    display: "flex",
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(6),
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
    "&:focus-within": {
      flex: 1,
    },
    transition: theme.transitions.create("flex"),
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    paddingTop: 9,
    paddingBottom: 9,
  },
  input: {
    width: "100%",
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  title: { paddingLeft: 24, paddingRight: 24, fontSize: 18 },
}));

const SearchBar: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState<string>("");

  const search = () => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    params.job = query;
    history.push({
      pathname: "/",
      search: qs.stringify(params, { addQueryPrefix: true }),
    });
  };

  return (
    <div className={classes.search}>
      <IconButton className={classes.searchIcon} onClick={search}>
        <Search />
      </IconButton>
      <InputBase
        placeholder="搜尋工作、地區、公司"
        value={query}
        className={classes.input}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
      />
    </div>
  );
};

interface Props {
  title?: string;
  progressValue?: number;
  hideSearchBar?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { title, progressValue, hideSearchBar } = props;
  const classes = useStyles();
  const location = useLocation();
  const [
    exploreMenuAnchorElement,
    setExploreMenuAnchorElement,
  ] = useState<null | HTMLElement>(null);
  const [
    profileMenuAnchorElement,
    setProfileMenuAnchorElement,
  ] = useState<null | HTMLElement>(null);
  const [
    mobileMenuAnchorElement,
    setMobileMenuAnchorElement,
  ] = useState<null | HTMLElement>(null);

  const openExploreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setExploreMenuAnchorElement(event.currentTarget);
  };

  const closeExploreMenu = () => {
    setExploreMenuAnchorElement(null);
  };

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchorElement(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileMenuAnchorElement(null);
  };

  const openMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorElement(event.currentTarget);
  };

  const closeMobileMenu = () => {
    setMobileMenuAnchorElement(null);
  };

  const isExploreMenuOpen = Boolean(exploreMenuAnchorElement);
  const isProfileMenuOpen = Boolean(profileMenuAnchorElement);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorElement);
  const isRecruiter = location.pathname.startsWith("/recruiter");
  const isHome = location.pathname === "/";

  const renderMobileMenu = isRecruiter ? (
    <RecruiterProfileMenu
      close={closeMobileMenu}
      isOpen={isMobileMenuOpen}
      anchorElement={mobileMenuAnchorElement}
    />
  ) : (
    <ApplicantProfileMenu
      close={closeMobileMenu}
      isOpen={isMobileMenuOpen}
      anchorElement={mobileMenuAnchorElement}
    />
  );

  return (
    <Headroom>
      <div className={classes.root}>
        <AppBar
          color="inherit"
          position="static"
          classes={{ root: classes.appBarRoot }}
        >
          <Toolbar>
            <Link to="/" style={{ textDecoration: "none", color: "#484848" }}>
              <img
                alt="logo"
                className={classes.logo}
                src={logo}
                height="30"
                width="30"
              />
            </Link>
            {hideSearchBar === false ||
            (hideSearchBar === undefined && !isHome && !isRecruiter) ? (
              <SearchBar />
            ) : (
              title && <div className={classes.title}>{title}</div>
            )}
            {isHome && (
              <Link to="/about" className={classes.link}>
                <span className={classes.tab}>關於我們</span>
              </Link>
            )}
            {isRecruiter && (
              <Link to="/help/pricing" className={classes.link}>
                <span className={classes.tab}>付費方案</span>
              </Link>
            )}

            <div className={classes.grow} />
            {isRecruiter ? (
              <>
                <RecruiterHeaderTabs
                  openExploreMenu={openExploreMenu}
                  openProfileMenu={openProfileMenu}
                />
                <RecruiterExploreMenu
                  close={closeExploreMenu}
                  isOpen={isExploreMenuOpen}
                  anchorElement={exploreMenuAnchorElement}
                />
                <RecruiterProfileMenu
                  close={closeProfileMenu}
                  isOpen={isProfileMenuOpen}
                  anchorElement={profileMenuAnchorElement}
                />
              </>
            ) : (
              <>
                <ApplicantHeaderTabs
                  openExploreMenu={openExploreMenu}
                  openProfileMenu={openProfileMenu}
                />
                <ApplicantExploreMenu
                  close={closeExploreMenu}
                  isOpen={isExploreMenuOpen}
                  anchorElement={exploreMenuAnchorElement}
                />
                <ApplicantProfileMenu
                  close={closeProfileMenu}
                  isOpen={isProfileMenuOpen}
                  anchorElement={profileMenuAnchorElement}
                />
              </>
            )}
            <div className={classes.sectionMobile}>
              {hideSearchBar === false && isHome && (
                <IconButton
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="inherit"
                >
                  <Search />
                </IconButton>
              )}
              <IconButton onClick={openExploreMenu} color="inherit">
                <Apps />
              </IconButton>
              <IconButton onClick={openMobileMenu} color="inherit">
                <Dehaze />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {progressValue && (
          <LinearProgress
            variant="determinate"
            color="primary"
            value={progressValue}
          />
        )}
        {renderMobileMenu}
      </div>
    </Headroom>
  );
};

export { Header };
