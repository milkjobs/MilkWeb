import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Smartphone } from "@material-ui/icons";
import to from "await-to-js";
import branch from "branch-sdk";
import { environment } from "config";
import firebase, { FirebaseError } from "firebase/app";
import "firebase/auth";
import { isIntlPhoneNumber, isValidVerificationCode } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown-now";
import { Link } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 36,
  },
  footer: {
    color: "grey",
    flex: 1,
    marginTop: 24,
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  row: {
    flex: 1,
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  textColumn: {
    flex: 2,
  },
  textInput: {
    height: 40,
  },
  buttonColumn: {
    flex: 1,
    height: 60,
    marginTop: 8,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 12,
    },
  },
  registerButton: {
    marginTop: 8,
  },
}));

interface Props {
  isOpen: boolean;
  close: () => void;
}

const LoginDialog: React.FC<Props> = ({ isOpen, close }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberHelperText, setPhoneNumberHelperText] = useState<string>();

  const [codeSent, setCodeSent] = useState(false);
  const [codeHelperText, setCodeHelperText] = useState<string>();
  const [code, setCode] = useState<string>();

  const [countdown, setCountdown] = useState(0);
  const [countdownKey, setCountdownKey] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState(true);

  const [recaptcha, setRecaptcha] = useState<firebase.auth.RecaptchaVerifier>();
  const [verifier, setVerifier] = useState<firebase.auth.ConfirmationResult>();

  const reset = () => {
    setLoading(false);
    setPhoneNumber(undefined);
    setPhoneNumberHelperText(undefined);
    setCodeSent(false);
    setCodeHelperText(undefined);
    setCode(undefined);
    setCountdown(0);
    setCountdownKey(0);
    setCountdownCompleted(true);
    setRecaptcha(undefined);
    setVerifier(undefined);
  };

  const checkPhoneNumber = () => {
    const helperText =
      !phoneNumber || !isIntlPhoneNumber(phoneNumber)
        ? "號碼不正確"
        : undefined;
    setPhoneNumberHelperText(helperText);

    return !helperText;
  };

  const checkCode = () => {
    const helperText =
      !code || !isValidVerificationCode(code)
        ? "驗證碼必須是六位數字"
        : undefined;
    setCodeHelperText(helperText);

    return !helperText;
  };

  const sendCode = async () => {
    if (!checkPhoneNumber() || !phoneNumber || !recaptcha) {
      return;
    }
    const [err, result] = await to(
      firebase.auth().signInWithPhoneNumber(phoneNumber, recaptcha)
    );
    if (err) {
      return;
    }
    setVerifier(result);
    setCodeSent(true);
    setCountdown(Date.now() + 59000);
    setCountdownKey((k) => k + 1);
    setCountdownCompleted(false);
  };

  const login = async () => {
    if (!checkCode() || !code || !phoneNumber || !verifier) {
      return;
    }

    setLoading(true);
    const [err, credential] = await to<
      firebase.auth.UserCredential,
      FirebaseError
    >(verifier.confirm(code));
    if (err) {
      setLoading(false);
      if (err.code === "auth/invalid-verification-code") {
        setCodeHelperText("驗證碼錯誤");
        return;
      }
      if (err.code === "auth/unknown") {
        setCodeHelperText("系統異常，請稍後再試");
        return;
      }
      if (err.code === "auth/code-expired") {
        setCodeHelperText("驗證碼失效，請重新發送後再試");
        return;
      }

      console.error(err.code);
      throw err;
    }

    // Send app download text to new users.
    if (
      environment === "production" &&
      credential?.additionalUserInfo?.isNewUser &&
      credential.user?.phoneNumber
    ) {
      branch.sendSMS(credential.user.phoneNumber, {});
    }
  };

  const recaptchaButton = useCallback(async (node) => {
    if (node) {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(node, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      });
      await recaptchaVerifier.render();
      setRecaptcha(recaptchaVerifier);
    }
  }, []);

  useEffect(() => {
    if (user) {
      close();
      reset();
    }
  }, [close, user]);

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogContent>
        <form
          noValidate
          autoComplete="on"
          className={classes.container}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div ref={recaptchaButton}></div>
          <div className={classes.row}>
            <TextField
              autoComplete="tel"
              autoFocus
              className={classes.textColumn}
              error={!!phoneNumberHelperText}
              fullWidth={isMobile}
              helperText={phoneNumberHelperText || ""}
              id="phone-number-input"
              margin="dense"
              placeholder="手機號碼"
              type="tel"
              value={phoneNumber ? phoneNumber.replace("+8869", "") : ""}
              variant="outlined"
              InputProps={{
                readOnly: !countdownCompleted,
                classes: { input: classes.textInput },
                startAdornment: (
                  <InputAdornment position="start">09</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Smartphone />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setPhoneNumber(`+8869${e.target.value}`);
                setPhoneNumberHelperText(undefined);
                setCodeSent(false);
              }}
              onBlur={checkPhoneNumber}
            />
            <Button
              className={classes.buttonColumn}
              color="primary"
              disabled={!countdownCompleted}
              fullWidth={isMobile}
              onClick={sendCode}
              type={!codeSent ? "submit" : "button"}
              variant="contained"
            >
              {!codeSent ? (
                "發送簡訊驗證碼"
              ) : (
                <Countdown
                  key={countdownKey}
                  date={countdown}
                  renderer={({ seconds, completed }) => {
                    if (completed) {
                      setCountdownCompleted(true);
                      return "再次發送驗證碼";
                    } else {
                      return `${seconds} 秒後再次發送`;
                    }
                  }}
                />
              )}
            </Button>
          </div>
          {codeSent && (
            <div className={classes.row}>
              <TextField
                autoFocus
                className={classes.textColumn}
                error={!!codeHelperText}
                fullWidth={isMobile}
                helperText={codeHelperText || ""}
                id="phone-number-verification-code-input"
                margin="dense"
                placeholder="驗證碼"
                type="number"
                value={code || ""}
                variant="outlined"
                InputProps={{
                  classes: { input: classes.textInput },
                }}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeHelperText(undefined);
                }}
                onBlur={checkCode}
              />
              <Button
                className={classes.buttonColumn}
                color="primary"
                fullWidth={isMobile}
                onClick={login}
                variant="contained"
                startIcon={
                  loading && <CircularProgress color="inherit" size={16} />
                }
              >
                登入
              </Button>
            </div>
          )}
          <div className={classes.footer}>
            發送驗證碼即表示你同意
            <Link to="/help/privacy" target="_blank" style={{ color: "grey" }}>
              隱私權政策
            </Link>
            、
            <Link to="/help/tos" target="_blank" style={{ color: "grey" }}>
              服務條款
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { LoginDialog };
