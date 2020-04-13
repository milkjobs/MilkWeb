import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import { ErrorStatus } from "components/Util";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

const NotFound: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <ErrorStatus
        subheader="我們似乎無法找到你要找的頁面。"
        description="錯誤代碼：404"
      />
    </div>
  );
};

export { NotFound };
