import {
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Smartphone, Visibility, VisibilityOff } from "@material-ui/icons";
import to from "await-to-js";
import { isIntlPhoneNumber } from "helpers";
import React, { useState } from "react";
import { useAuth } from "stores";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 36
  },
  row: {
    flex: 1
  },
  loginButton: {
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
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberHelperText, setPhoneNumberHelperText] = useState<string>();

  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState<string>();

  const checkPhoneNumber = () => {
    const helperText =
      !phoneNumber || !isIntlPhoneNumber(phoneNumber)
        ? "號碼不正確"
        : undefined;
    setPhoneNumberHelperText(helperText);

    return !helperText;
  };

  const checkPassword = () => {
    const helperText = !password ? "密碼不得為空" : undefined;
    setPasswordHelperText(helperText);

    return !helperText;
  };

  const tryLogin = async () => {
    if (!checkPhoneNumber() || !checkPassword() || !phoneNumber || !password) {
      return;
    }
    const [err] = await to(
      login({
        phoneNumber,
        password
      })
    );
    err && setPasswordHelperText("手機號碼或密碼錯誤");
  };

  return (
    <Dialog open={isOpen} onClose={close}>
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
              autoComplete="tel"
              autoFocus
              error={!!phoneNumberHelperText}
              fullWidth
              helperText={phoneNumberHelperText || ""}
              id="phone-number-input"
              placeholder="手機號碼"
              margin="dense"
              variant="outlined"
              InputProps={{
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
              }}
              onBlur={checkPhoneNumber}
            />
          </div>
          <div className={classes.row}>
            <TextField
              autoComplete="current-password"
              error={!!passwordHelperText}
              fullWidth
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
              className={classes.loginButton}
              color="primary"
              fullWidth
              onClick={tryLogin}
              type="submit"
              variant="contained"
            >
              登入
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { LoginDialog };
