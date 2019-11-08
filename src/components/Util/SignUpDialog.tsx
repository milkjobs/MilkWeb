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
import IconButton from "@material-ui/core/IconButton";
import {
  Person,
  Smartphone,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import to from "await-to-js";
import {
  isIntlPhoneNumber,
  isValidPassword,
  isValidVerificationCode
} from "helpers";
import React, { useState } from "react";
import Countdown from "react-countdown-now";
import { useAuth } from "stores";

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

const SignUpDialog: React.FC<Props> = props => {
  const { isOpen, close } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getApi, signup } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberHelperText, setPhoneNumberHelperText] = useState<string>();

  const [codeSent, setCodeSent] = useState(false);
  const [codeHelperText, setCodeHelperText] = useState<string>();
  const [code, setCode] = useState<string>();

  const [signUpToken, setSignUpToken] = useState<string>();

  const [name, setName] = useState<string>();
  const [nameHelperText, setNameHelperText] = useState<string>();

  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState<string>();

  const [countdown, setCountdown] = useState(0);
  const [countdownKey, setCountdownKey] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState(true);

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

  const checkName = () => {
    const helperText = !name || name.length === 0 ? "姓名不得為空" : undefined;
    setNameHelperText(helperText);

    return !helperText;
  };

  const checkPassword = () => {
    const helperText =
      !password || !isValidPassword(password) ? "密碼長度至少為八" : undefined;
    setPasswordHelperText(helperText);

    return !helperText;
  };

  const sendCode = async () => {
    if (!checkPhoneNumber() || !phoneNumber) {
      return;
    }
    const verificationApi = await getApi("Verification");
    await to(
      verificationApi.sendPhoneVerificationCode({
        phoneNumber
      })
    );
    setCodeSent(true);
    setCountdown(Date.now() + 59000);
    setCountdownKey(k => k + 1);
    setCountdownCompleted(false);
  };

  const verifyCode = async () => {
    if (!checkCode() || !code || !phoneNumber) {
      return;
    }
    const verificationApi = await getApi("Verification");
    const [err, signUpToken] = await to(
      verificationApi.verifyPhoneVerificationCode({
        phoneNumber,
        code
      })
    );

    if (err || !signUpToken) {
      setCodeHelperText("驗證碼錯誤");
    } else {
      setSignUpToken(signUpToken);
    }
  };

  const register = async () => {
    if (
      !checkName() ||
      !checkPassword() ||
      !name ||
      !phoneNumber ||
      !password ||
      !signUpToken
    ) {
      return;
    }
    await to(
      signup({
        name,
        phoneNumber,
        password,
        token: signUpToken
      })
    );
  };

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
                readOnly: !!signUpToken || !countdownCompleted,
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
              disabled={!!signUpToken || !countdownCompleted}
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
                  InputProps={{
                    readOnly: !!signUpToken
                  }}
                />
                <Button
                  className={classes.buttonColumn}
                  color="primary"
                  disabled={!!signUpToken}
                  fullWidth={isMobile}
                  onClick={verifyCode}
                  variant="contained"
                >
                  驗證
                </Button>
              </>
            )}
          </div>
          {signUpToken && (
            <>
              <div className={classes.row}>
                <TextField
                  value={name}
                  autoFocus
                  autoComplete="name"
                  className={classes.textColumn}
                  error={!!nameHelperText}
                  fullWidth={isMobile}
                  helperText={nameHelperText || ""}
                  id="name-input"
                  margin="dense"
                  placeholder="姓名"
                  variant="outlined"
                  onChange={e => {
                    setName(e.target.value);
                    setNameHelperText(undefined);
                  }}
                  onBlur={checkName}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Person />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className={classes.row}>
                <TextField
                  value={password}
                  autoComplete="new-password"
                  className={classes.textColumn}
                  error={!!passwordHelperText}
                  fullWidth={isMobile}
                  helperText={passwordHelperText || ""}
                  id="password-input"
                  margin="dense"
                  placeholder="密碼"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  onChange={e => {
                    setPassword(e.target.value);
                    setPasswordHelperText(undefined);
                  }}
                  onBlur={checkPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(x => !x)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className={classes.row}>
                <Button
                  className={classes.registerButton}
                  color="primary"
                  fullWidth
                  onClick={register}
                  type="submit"
                  variant="contained"
                >
                  註冊
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { SignUpDialog };
