import { makeStyles } from "@material-ui/core";
import to from "await-to-js";
import { Header } from "components/Header";
import qs from "qs";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "stores";
import { LoginDialog } from "components/Util";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    fontSize: 24,
    paddingLeft: 24,
    paddingRight: 24,
    whiteSpace: "pre-line",
    [theme.breakpoints.up("md")]: {
      width: "960px",
    },
  },
}));

const EmailConfirm: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { getApi, user, reloadUser } = useAuth();
  const classes = useStyles();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [err, setErr] = useState(false);

  const emailVerification = async (code: string) => {
    const verificationApi = await getApi("Verification");
    const [err] = await to(verificationApi.confirmEmail({ code }));
    if (!err) {
      await reloadUser();
      history.push("/recruiter");
    } else {
      setErr(true);
      setTimeout(() => {
        history.push("/recruiter/message");
      }, 5000);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoginDialogOpen(true);
    } else {
      const values = qs.parse(location.search, { ignoreQueryPrefix: true });
      const code = values.code;
      code && emailVerification(code);
    }
  }, [user]);

  return (
    <div>
      <Header />
      <div className={classes.container}>
        {err
          ? "驗證失敗，請重新發送驗證信。\n可以在訊息告知牛奶找工作官方帳號，我們會幫你解決你的問題"
          : "Email 驗證中"}
      </div>
      <LoginDialog
        isOpen={loginDialogOpen}
        close={() => setLoginDialogOpen(false)}
      />
    </div>
  );
};

export default EmailConfirm;
