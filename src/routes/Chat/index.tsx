import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect } from "react";
import { useAuth } from "stores";
import chat from "tlk";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.background.paper
  },
  container: {
    flex: 3,
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    paddingRight: 48,
    paddingLeft: 48,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: 8,
      marginBottom: 8,
      paddingRight: 24,
      paddingLeft: 24
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingBottom: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    fontSize: 20,
    textAlign: "left",
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
  },
  chatRoom: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 600
  }
}));

const Chat: React.FC = () => {
  const { user } = useAuth();
  const classes = useStyles();

  useEffect(() => {
    chat();
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
        <div className={classes.chatRoom}>
          <div
            id="tlkio"
            data-channel="NTU"
            data-nickname={user ? user.name : "路人"}
            data-theme="theme--minimal"
            style={{ height: "80vh" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
