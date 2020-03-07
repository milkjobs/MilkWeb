import {
  Card,
  CardHeader,
  GridList,
  GridListTile,
  makeStyles,
  useMediaQuery
} from "@material-ui/core";
import { Header } from "components/Header";
import { Title } from "components/Util";
import { PageMetadata } from "helpers";
import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useTheme } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none"
  },
  card: {
    display: "flex",
    height: "100%"
  },
  cardHeader: {
    flex: 1
  }
}));

const HelpCenter: React.FC = () => {
  const match = useRouteMatch();
  const classes = useStyles();
  const { theme } = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const large = useMediaQuery(theme.breakpoints.up("md"));

  return (
    match && (
      <div className={classes.root}>
        <PageMetadata title="幫助中心－牛奶找工作" />
        <Header />
        <div className={classes.container}>
          <Title text="幫助中心" />
          <GridList cellHeight={100} cols={large ? 4 : small ? 1 : 2}>
            <GridListTile cols={1}>
              <Link to="/help/privacy" className={classes.link}>
                <Card variant="outlined" className={classes.card}>
                  <CardHeader
                    title="隱私權政策"
                    className={classes.cardHeader}
                  />
                </Card>
              </Link>
            </GridListTile>
            <GridListTile cols={1}>
              <Link to="/help/tos" className={classes.link}>
                <Card variant="outlined" className={classes.card}>
                  <CardHeader title="服務條款" className={classes.cardHeader} />
                </Card>
              </Link>
            </GridListTile>
            <GridListTile cols={1}>
              <Link to="/help/pricing" className={classes.link}>
                <Card variant="outlined" className={classes.card}>
                  <CardHeader title="付費方案" className={classes.cardHeader} />
                </Card>
              </Link>
            </GridListTile>
            <GridListTile cols={1}>
              <Link to="/help/faq" className={classes.link}>
                <Card variant="outlined" className={classes.card}>
                  <CardHeader title="常見問題" className={classes.cardHeader} />
                </Card>
              </Link>
            </GridListTile>
          </GridList>
          <div style={{ display: "flex" }}></div>
        </div>
      </div>
    )
  );
};

export default HelpCenter;
