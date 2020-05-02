import { makeStyles, Button } from "@material-ui/core";
import React, { useState } from "react";
import { useAuth } from "stores";
import { DownloadApp } from "components/Util";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  emailContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 60,
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.palette.action.hover,
  },
  emailHint: {
    fontSize: 16,
  },
  emailForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const EmailForm: React.FC = () => {
  const classes = useStyles();
  const { user, getApi, reloadUser } = useAuth();
  const [downloadAppOpen, setDownloadAppOpen] = useState(false);
  const [email, setEmail] = useState<string | undefined>(
    user?.recruiterInfo?.email
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();

  const resendVerificationEmail = async () => {
    if (emailErrorMessage) {
      return;
    }
    const recruiterInfoApi = await getApi("RecruiterInfo");

    if (user?.recruiterInfo?.uuid && email !== user.recruiterInfo.email) {
      await recruiterInfoApi.updateRecruiterInfo({
        recruiterInfoId: user.recruiterInfo.uuid,
        recruiterInfo: {
          ...user.recruiterInfo,
          email,
        },
      });
    }
    user?.recruiterInfo?.uuid &&
      (await recruiterInfoApi.resendEmailConfirmation({
        recruiterInfoId: user?.recruiterInfo?.uuid,
      }));
    await reloadUser();
  };

  const saveEmail = async () => {
    if (emailErrorMessage) {
      return;
    }

    if (user?.recruiterInfo?.uuid && email) {
      const recruiterInfoApi = await getApi("RecruiterInfo");
      await recruiterInfoApi.updateRecruiterInfo({
        recruiterInfoId: user.recruiterInfo.uuid,
        recruiterInfo: {
          ...user.recruiterInfo,
          email,
        },
      });
    }
    await reloadUser();
  };

  if (user?.recruiterInfo?.email) return <div />;

  return (
    <div className={classes.emailContainer}>
      <div className={classes.emailHint}>
        {"告訴我們你的 email 或下載我們的 App"}
      </div>
      <div className={classes.emailHint}>
        {"有求職者應徵、審核通過或其他問題時，讓我們可以第一時間通知你"}
      </div>
      <div className={classes.emailForm}>
        <TextField
          style={{ width: 200 }}
          id="standard-basic"
          label="Email"
          onBlur={() => {
            function validateEmail(email) {
              let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(String(email).toLowerCase());
            }
            !validateEmail(email) && setEmailErrorMessage("請輸入正確的email");
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
            setEmailErrorMessage(undefined);
          }}
          value={email}
          error={Boolean(emailErrorMessage)}
          helperText={emailErrorMessage}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: 16, marginLeft: 16 }}
          onClick={
            user?.recruiterInfo?.email ? resendVerificationEmail : saveEmail
          }
        >
          {user?.recruiterInfo?.email ? "重寄驗證信" : "送出"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDownloadAppOpen(true)}
        >
          {"下載 App"}
        </Button>
        <DownloadApp
          isOpen={downloadAppOpen}
          close={() => setDownloadAppOpen(false)}
          recruiterMode
        />
      </div>
    </div>
  );
};

export { EmailForm };
