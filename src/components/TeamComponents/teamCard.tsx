import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import React, { Component } from "react";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 8,
      marginLeft: 24,
      paddingLeft: 24,
      marginBottom: 12,
      paddingRight: 24,
      paddingTop: 16,
      paddingBottom: 16,
      display: "flex",
      flexDirection: "column",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      [theme.breakpoints.up("sm")]: {
        width: "600px"
      }
    },
    title: {
      display: "flex",
      flex: 1,
      fontSize: 18,
      fontWeight: 400,
      marginBottom: 8
    },
    tags: {
      display: "flex",
      flex: 1,
      marginBottom: 8
    },
    tag: {
      fontSize: 14,
      backgroundColor: "#D8D8D8",
      color: "white",
      marginRight: 8,
      paddingLeft: 4,
      paddingRight: 4
    },
    teamName: {
      fontSize: 14,
      marginRight: 16
    },
    infoTag: {
      fontSize: 14,
      color: "#9B9B9B",
      marginRight: 8
    },
    detail: {
      display: "flex",
      flex: 1,
      marginTop: 8
    },
    description: {
      flex: 4,
      fontSize: 14,
      textAlign: "left",
      color: "#9B9B9B"
    },
    salary: {
      flex: 1,
      fontSize: 14,
      textAlign: "right",
      marginTop: "auto"
    }
  });
interface Props extends WithStyles<typeof styles> {
  teamName: string;
  teamFieldTags: string[];
  teamSize: string;
  teamLocation: string;
  teamDescription: string;
  teamRecruit: string;
}

class TeamCard extends Component<Props> {
  static defaultProps = {
    teamName: "誠品文化公司",
    teamFieldTags: ["文化產業", "出版產業"],
    teamLocation: "台北市信義區松德路196號B1",
    teamSize: "2000人",
    teamDescription:
      "誠品書店1989年由臺北仁愛路圓環創辦第壹家開始，本著人文、藝術、創意、生活的初衷，發展為今日以文化創意為核心的復合式經營模式。",
    teamRecruit: "行政人員"
  };
  render() {
    const {
      classes,
      teamName,
      teamLocation,
      teamSize,
      teamDescription,
      teamRecruit
    } = this.props;
    return (
      <div className={classes.container}>
        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ flex: 3 }}>
            <span className={classes.title}>{teamName}</span>
            <span className={classes.tags}>
              <span className={classes.tag}>文化產業</span>
              <span className={classes.tag}>出版產業</span>
            </span>
            <span className={classes.tags}>
              <span className={classes.teamName}>
                {teamLocation + " · " + teamSize}
              </span>
            </span>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <FavoriteBorderIcon color="error" />
          </div>
        </div>

        <span className={classes.detail}>
          <span className={classes.description}>{teamDescription}</span>
          <span className={classes.salary}>
            招<span style={{ color: "#69C0FF" }}>{teamRecruit}</span>
            <br />
            等30個職缺
          </span>
        </span>
      </div>
    );
  }
}

export default withStyles(styles)(TeamCard);
