import { AwesomeList } from "@frankyjuang/milkapi-client";
import { Button, makeStyles, Theme, useMediaQuery } from "@material-ui/core";
import to from "await-to-js";
import { openInNewTab } from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  }
}));

interface Props {
  showStories?: boolean;
  showChatRoom?: boolean;
}

const AwesomeHeader: React.FC<Props> = ({ showStories, showChatRoom }) => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const [awesomeLists, setAwesomeLists] = useState<AwesomeList[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  useEffect(() => {
    const getLists = async () => {
      const awesomeApi = await getApi("Awesome");
      const [, lists] = await to(awesomeApi.getAwesomeLists({}));
      lists && setAwesomeLists(lists);
    };

    getLists();
  }, [getApi]);

  return (
    <div className={classes.schoolContainer}>
      {showStories ? (
        <Link to={{ pathname: "/stories" }} className={classes.majorButton}>
          <Button>故事</Button>
        </Link>
      ) : (
        <div className={classes.schoolTitle}>就業精選</div>
      )}
      {awesomeLists.slice(0, showMore ? awesomeLists.length : 20).map(list => (
        <Link
          key={list.name}
          to={{ pathname: `/awesome/${list.name}` }}
          className={classes.majorButton}
        >
          <Button>{list.name}</Button>
        </Link>
      ))}
      {!showMore && (
        <Button onClick={() => setShowMore(true)}>{"看更多"}</Button>
      )}
      {showMore && <Button onClick={() => setShowMore(false)}>{"收回"}</Button>}
      {showChatRoom && matched && (
        <div
          onClick={() => openInNewTab("https://tlk.io/ntu")}
          className={classes.majorButton}
        >
          <Button>找工作聊天室</Button>
        </div>
      )}
    </div>
  );
};

export { AwesomeHeader };
