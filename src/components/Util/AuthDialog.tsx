import {
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { Smartphone } from "@material-ui/icons";
import to from "await-to-js";
import firebase from "firebase/app";
import "firebase/auth";
import { isIntlPhoneNumber, isValidVerificationCode } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown-now";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 36
  },
  row: {
    flex: 1,
    [theme.breakpoints.up("sm")]: {
      display: "flex"
    }
  },
  textColumn: {
    flex: 2
  },
  buttonColumn: {
    flex: 1,
    height: 40,
    marginTop: 8,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 12
    }
  },
  registerButton: {
    marginTop: 8
  }
}));

interface Props {
  isOpen: boolean;
  close: () => void;
}

const LoginDialog: React.FC<Props> = props => {
  const { isOpen, close } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    setCountdownKey(k => k + 1);
    setCountdownCompleted(false);
  };

  const login = async () => {
    if (!checkCode() || !code || !phoneNumber || !verifier) {
      return;
    }
    const [err, result] = await to(verifier.confirm(code));

    if (err || !result) {
      setCodeHelperText("驗證碼錯誤");
      return;
    }
    console.log(result);
  };

  const recaptchaButton = useCallback(node => {
    node &&
      setRecaptcha(
        new firebase.auth.RecaptchaVerifier(node, { size: "invisible" })
      );
  }, []);

  useEffect(() => {
    firebase.auth().languageCode = "zh-TW";
  }, []);

  return (
    <Dialog open={isOpen} onClose={() => close()}>
      <DialogContent>
        <form
          noValidate
          autoComplete="on"
          className={classes.container}
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div className={classes.row}>
            <TextField
              value={phoneNumber ? phoneNumber.replace("+8869", "") : ""}
              autoFocus
              autoComplete="tel"
              className={classes.textColumn}
              error={!!phoneNumberHelperText}
              fullWidth={isMobile}
              helperText={phoneNumberHelperText || ""}
              id="phone-number-input"
              placeholder="手機號碼"
              margin="dense"
              variant="outlined"
              InputProps={{
                readOnly: !countdownCompleted,
                startAdornment: (
                  <InputAdornment position="start">09</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Smartphone />
                  </InputAdornment>
                )
              }}
              onChange={e => {
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
              ref={recaptchaButton}
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
          <div className={classes.row}>
            {codeSent && (
              <>
                <TextField
                  value={code}
                  autoFocus
                  className={classes.textColumn}
                  error={!!codeHelperText}
                  fullWidth={isMobile}
                  helperText={codeHelperText || ""}
                  id="phone-number-verification-code-input"
                  placeholder="驗證碼"
                  margin="dense"
                  variant="outlined"
                  onChange={e => {
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
                >
                  登入
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { LoginDialog };
