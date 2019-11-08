import React, { useState } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MilkSelect from "components/Util/Select";
import AutoSuggestion from "components/Util/AutoSuggestion";
import { withRouter, RouteComponentProps } from "react-router-dom";
import CreateJobFooter from "./createJobFooter";

const CreateJobInfo: React.FC<Props> = props => {
  const [open, setOpen] = useState(false);
  const [educationLimit, setEducationLimit] = useState(
    props.job.educationLimit
  );
  const [educationLimitErrorMessage, setEducationLimitErrorMessage] = useState(
    ""
  );
  const [experienceLimit, setExperienceLimit] = useState(
    props.job.experienceLimit
  );
  const [
    experienceLimitErrorMessage,
    setExperienceLimitErrorMessage
  ] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { classes, history } = props;
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>讓我們來填寫職缺的基本資料吧!</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>學歷要求</div>
            <MilkSelect
              value={educationLimit}
              handleChange={educationLimit => {
                setEducationLimit(educationLimit.value);
                setEducationLimitErrorMessage("");
              }}
              placeholder={"請選擇學歷要求"}
              options={[
                { value: "不限", label: "不限" },
                { value: "高中/大專", label: "高中/大專" },
                { value: "大學", label: "大學" },
                { value: "研究所", label: "研究所" },
                { value: "博士", label: "博士" }
              ]}
              errorMessage={educationLimitErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>經驗要求</div>
            <MilkSelect
              value={experienceLimit}
              handleChange={experienceLimit => {
                setExperienceLimit(experienceLimit.value);
                setExperienceLimitErrorMessage("");
              }}
              placeholder={"請選擇工作經驗要求"}
              options={[
                { value: "不限", label: "不限" },
                { value: "1年", label: "1年" },
                { value: "2年～5年", label: "2年～5年" },
                { value: "5年~10年", label: "5年~10年" },
                { value: "10年以上", label: "10年以上" }
              ]}
              errorMessage={experienceLimitErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>預計招募人數</div>
            <MilkSelect
              value={""}
              handleChange={field => {}}
              placeholder={"請選擇預計招募人數"}
              options={[
                { value: "1位", label: "1位" },
                { value: "2~5位", label: "2~5位" },
                { value: "5~10位", label: "5~10位" },
                { value: "10位以上", label: "10位以上" }
              ]}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>所需要的技能或技能要求</div>
            <AutoSuggestion
              value={""}
              onChange={(event, { newValue }) => {}}
              placeholder={"請選擇所需要的技能"}
              onFocus={handleOpen}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To subscribe to this website, please enter your email address
                  here. We will send updates occasionally.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleClose} color="primary">
                  Subscribe
                </Button>
              </DialogActions>
            </Dialog>
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
            nextText={"下一步"}
            nextClick={() => {
              if (educationLimit === "") {
                setEducationLimitErrorMessage("請選擇學歷限制");
              }
              if (experienceLimit === "") {
                setExperienceLimitErrorMessage("請選擇經驗限制");
              }
              if (educationLimit !== "" && experienceLimit !== "") {
                props.nextClick({
                  educationLimit,
                  experienceLimit
                });
                history.push("/recruiter/create-a-job/description");
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
      marginBottom: 8,
      marginTop: 8,
      marginRight: "auto"
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
  nextClick: (job: any) => void;
  job: any;
}

export default withStyles(styles)(withRouter(CreateJobInfo));
