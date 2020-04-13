import { makeStyles } from "@material-ui/core";
import to from "await-to-js";
import { Header } from "components/Header";
import qs from "qs";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "stores";

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
    [theme.breakpoints.up("md")]: {
      width: "960px",
    },
  },
}));

const EmailConfirm: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { getApi } = useAuth();
  const classes = useStyles();

  const emailVerification = async (code: string) => {
    const verificationApi = await getApi("Verification");
    const [err] = await to(verificationApi.confirmEmail({ code }));
    if (!err) {
      history.push("/recruiter");
    }
  };

  useEffect(() => {
    const values = qs.parse(location.search);
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
