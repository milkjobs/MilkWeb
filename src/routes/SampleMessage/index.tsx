import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { SampleMessageBox } from "components/Message";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  title: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    color: theme.palette.text.primary,
    fontSize: 24,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  contacts: {
    border: "1px solid #EBEBEB",
    flex: 1,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  buttonGroup: {
    marginTop: 16,
    marginBottom: 16,
  },
}));

const SampleMessage: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div
          style={{
            display: "flex",
            flex: 3,
            position: "relative",
          }}
        >
          <SampleMessageBox />
        </div>
      </div>
    </div>
  );
};

export default SampleMessage;
