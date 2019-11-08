import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 24,
    paddingLeft: 24,
    marginBottom: 12,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 16,
    display: "flex",
    flexDirection: "column"
  },
  title: {
    display: "flex",
    flex: 1,
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: "#484848"
  }
}));

const TeamPhotos: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>照片</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <div style={{ flex: 1, padding: 5 }}>
          <img
            alt="team profile"
            style={{ width: "100%" }}
            src={
              "https://i.marieclaire.com.tw/aq/2016/02/8/201602031735504298.png"
            }
          />
        </div>
        <div style={{ flex: 1, padding: 5 }}>
          <img
            alt="team profile"
            style={{ width: "100%" }}
            src={
              "https://i.marieclaire.com.tw/aq/2016/02/8/201602031735504298.png"
            }
          />
        </div>
        <div style={{ flex: 1, padding: 5 }}>
          <img
            alt="team profile"
            style={{ width: "100%" }}
            src={
              "https://i.marieclaire.com.tw/aq/2016/02/8/201602031735504298.png"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPhotos;
