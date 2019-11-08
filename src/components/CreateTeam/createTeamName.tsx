import React, { useState } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import AutoSuggestion from "components/Util/AutoSuggestion";
import CreateTeamFooter from "./createTeamFooter";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Team } from "@frankyjuang/milkapi-client";

const CreateTeamName: React.FC<Props> = props => {
  const { classes, history, team } = props;
  const [companyName, setCompanyName] = useState(team.name);
  const [companyNameErrorMessage, setCompanyNameErrorMessage] = useState("");
  const [userWorkName, setUserWorkName] = useState("");
  const [userWorkNameErrorMessage, setUserWorkNameErrorMessage] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userTitleErrorMessage, setUserTitleErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>讓我們先了解你</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司全稱</div>
            <AutoSuggestion
              value={companyName}
              onChange={(event, { newValue }) => {
                setCompanyName(newValue);
                setCompanyNameErrorMessage("");
              }}
              placeholder={"請填寫與營利事業登記證一致的公司全稱"}
              errorMessage={companyNameErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>姓名</div>
            <AutoSuggestion
              value={userWorkName}
              onChange={(event, { newValue }) => {
                setUserWorkName(newValue);
                setUserWorkNameErrorMessage("");
              }}
              placeholder={"填寫你在工作中用的姓名，用於求職者展示"}
              errorMessage={userWorkNameErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>職位</div>
            <AutoSuggestion
              value={userTitle}
              onChange={(event, { newValue }) => {
                setUserTitle(newValue);
                setUserTitleErrorMessage("");
              }}
              placeholder={"請填寫當前公司的任職職位"}
              errorMessage={userTitleErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>E-mail(選填)</div>
            <AutoSuggestion
              value={userEmail}
              onChange={(event, { newValue }) => setUserEmail(newValue)}
              placeholder={"請填寫工作中常用的電子信箱，用於接受求職者履歷用"}
            />
          </div>
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
      <div className={classes.footer}>
        <div className={classes.layoutBiasLeft} />
        <div
          className={classes.layoutContent}
          style={{
            borderTop: "1px solid #EBEBEB",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <CreateTeamFooter
            nextText={"下一步"}
            nextClick={() => {
              if (companyName === "") {
                setCompanyNameErrorMessage("請輸入公司全稱");
              }
              if (userWorkName === "") {
                setUserWorkNameErrorMessage("請輸入你在工作中使用的姓名");
              }
              if (userTitle === "") {
                setUserTitleErrorMessage("請輸入你在公司的職稱");
              }
              if (
                companyName !== "" &&
                userWorkName !== "" &&
                userTitle !== ""
              ) {
                props.nextClick({
                  name: companyName
                });
                history.push("/create-team/info");
              }
            }}
          />
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 24,
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: 150,
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.up("md")]: {
        marginTop: 40
      }
    },
    title: {
      display: "flex",
      alignItems: "center",
      fontSize: 16,
      fontWeight: 400,
      [theme.breakpoints.up("md")]: {
        fontSize: 24
      }
    },
    titleContainer: {
      display: "flex",
      marginBottom: 12,
      width: "auto"
    },
    selectContainer: {
      flex: 1
    },
    selectTitle: {
      display: "flex",
      marginRight: "auto",
      marginBottom: 8,
      marginTop: 8
    },
    layoutBiasLeft: {
      [theme.breakpoints.up("md")]: {
        flex: 1
      }
    },
    layoutContent: {
      [theme.breakpoints.up("md")]: {
        minWidth: 500
      },
      flex: 3,
      flexDirection: "column",
      display: "flex"
    },
    layoutBiasRight: {
      [theme.breakpoints.up("md")]: {
        flex: 4
      }
    },
    footer: {
      position: "fixed",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "white",
      bottom: 0,
      minHeight: 100,
      marginTop: "auto"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextClick: (team: any) => void;
  team: Team;
}

export default withStyles(styles)(withRouter(CreateTeamName));
