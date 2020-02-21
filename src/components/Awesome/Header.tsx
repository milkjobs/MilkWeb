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
      {[
        { name: "中興獸醫", link: "中興獸醫" },
        { name: "台大電機", link: "台大電機" },
        { name: "政大政治", link: "政大政治" },
        { name: "成大建築", link: "成大建築" },
        { name: "台大資工", link: "台大資工" },
        { name: "中央數學", link: "國立中央大學數學系" },
        { name: "東華中文", link: "國立東華大學中國文學系" },
        { name: "交大電子", link: "國立交通大學電子學系" },
        { name: "陽明醫學", link: "國立陽明大學醫學系" },
        { name: "高大資管", link: "國立高雄大學資訊管理學系" }
      ].map(list => (
        <Link
          key={list.name}
          to={{ pathname: `/awesome/${list.link}` }}
          className={classes.majorButton}
        >
          <Button>{list.name}</Button>
        </Link>
      ))}
      <Link to={{ pathname: "/departments" }} className={classes.majorButton}>
        <Button>{"看更多"}</Button>
      </Link>
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
