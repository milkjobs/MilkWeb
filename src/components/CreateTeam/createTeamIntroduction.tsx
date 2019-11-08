import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CreateTeamFooter from "./createTeamFooter";
import { Team } from "@frankyjuang/milkapi-client";

const CreateTeamIntroduction: React.FC<Props> = props => {
  const { team } = props;
  const [introduction, setIntroduction] = useState(team.introduction);
  const [introductionErrorMessage, setIntroductionErrorMessage] = useState("");
  const { classes } = props;
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>介紹一下你的公司</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>
              填寫公司介紹，向求職者展現你的團隊、公司的產品和工作氣氛！
            </div>
            <div className={classes.textField}>
              <TextField
                value={introduction}
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
                onChange={event => setIntroduction(event.target.value)}
                style={{ width: "100%" }}
                id="outlined-multiline-flexible"
                multiline
                rows="20"
                margin="normal"
                variant="outlined"
              />
              {!!introductionErrorMessage && (
                <div className={classes.errorMessage}>
                  {introductionErrorMessage}
                </div>
              )}
            </div>
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
            nextText={"完成"}
            nextClick={() => {
              if (introduction === "") {
                setIntroductionErrorMessage("請輸入公司介紹");
              } else {
                props.nextClick({
                  ...team,
                  introduction: introduction
                });
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
        marginTop: 60
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
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16
    },
    selectTitle: {
      display: "flex",
      marginBottom: 12,
      marginRight: "auto",
      color: "#767676"
    },
    textField: {
      [theme.breakpoints.up("md")]: {
        maxWidth: 600
      }
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
    cssOutlinedInput: {
      "&$cssFocused $notchedOutline": {
        borderColor: "#69C0FF"
      }
    },
    cssFocused: {},
    notchedOutline: {},
    footer: {
      position: "fixed",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "white",
      bottom: 0,
      minHeight: 100,
      marginTop: "auto"
    },
    errorMessage: {
      fontSize: "12px",
      color: "rgb(244, 67, 54)",
      marginRight: "auto",
      display: "flex"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextClick: (team: any) => void;
  team: Team;
}

export default withStyles(styles)(withRouter(CreateTeamIntroduction));
