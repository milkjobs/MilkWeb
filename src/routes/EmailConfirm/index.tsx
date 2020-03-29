import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import to from "await-to-js";

const useStyles = makeStyles(theme => ({
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
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  }
}));

const EmailConfirm: React.FC = props => {
  const location = useLocation();
  const history = useHistory();
  const { getApi } = useAuth();
  const classes = useStyles();
  const [hint, setHint] = useState("Email 驗證中");

  const emailVerification = async (code: string) => {
    const verificationApi = await getApi("Verification");
    const [err, res] = await to(verificationApi.confirmEmail({ code }));
    if (!err) history.push("/recruiter");
    else setHint("驗證碼錯誤或已過期");
  };

  useEffect(() => {
    const values = queryString.parse(location.search);
    const code = values.code;
    code && emailVerification(code);
  }, []);

  return (
    <div>
      <Header />
      <div className={classes.container}>Email 驗證中</div>
    </div>
  );
};

export default EmailConfirm;
