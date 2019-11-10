import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import firebase from "firebase";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const Captcha: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    function getToken(callback) {
      var captcha = new firebase.auth.RecaptchaVerifier("captcha", {
        size: "normal",
        callback: function(token) {
          callback(token);
        },
        "expired-callback": function() {
          callback("");
        }
      });
      captcha.render().then(function() {
        captcha.verify();
      });
    }

    function sendTokenToApp(token) {
      var baseUri = decodeURIComponent(
        location.search.replace(/^\?appurl\=/, "")
      );
      window.location.href = baseUri + "/?token=" + encodeURIComponent(token);
    }

    getToken(sendTokenToApp);
  }, []);

  return <div id={"captcha"} className={classes.root}></div>;
};

export default Captcha;
