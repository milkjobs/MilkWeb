import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CreateJobFooter from "./createJobFooter";

const CreateJobDescription: React.FC<Props> = props => {
  const { classes, job } = props;
  const [description, setDescription] = useState(job.description);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

  return (
    <div style={{ height: "100%" }}>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>介紹一下你的職缺</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>
              填寫職缺介紹，向求職者說明這份工作需要做什麼、會使用到哪些技能、可以獲得什麼樣的成長
            </div>
            <div className={classes.textField}>
              <TextField
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                  setDescriptionErrorMessage("");
                }}
                style={{ width: "100%" }}
                id="outlined-multiline-flexible"
                multiline
                rows="20"
                margin="normal"
                variant="outlined"
              />
              {!!descriptionErrorMessage && (
                <div className={classes.errorMessage}>
                  {descriptionErrorMessage}
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
          <CreateJobFooter
            nextText={"完成"}
            nextClick={() => {
              if (description === "") {
                setDescriptionErrorMessage("請輸入職缺介紹");
              } else {
                props.nextClick({
                  ...job,
                  description: description
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
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16
    },
    selectTitle: {
      display: "flex",
      marginBottom: 12,
      marginRight: "auto",
      textAlign: "left",
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
    cssOutlinedInput: {
      "&$cssFocused $notchedOutline": {
        borderColor: "#69C0FF"
      }
    },
    errorMessage: {
      fontSize: "12px",
      color: "rgb(244, 67, 54)",
      marginRight: "auto",
      display: "flex"
    },
    cssFocused: {},
    notchedOutline: {}
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextClick: (job: any) => void;
  job: any;
}

export default withStyles(styles)(withRouter(CreateJobDescription));
