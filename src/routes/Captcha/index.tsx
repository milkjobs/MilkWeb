import firebase from "firebase/app";
import "firebase/auth";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import urljoin from "url-join";

const Captcha: React.FC = () => {
  const location = useLocation();
  const captchaDomId = "captcha";

  useEffect(() => {
    const getToken = async () => {
      const captcha = new firebase.auth.RecaptchaVerifier(captchaDomId, {
        size: "invisible"
      });
      await captcha.render();
      const token = await captcha.verify();

      // Redirect back to app.
      const qs = queryString.parse(location.search);
      if (typeof qs.appurl === "string") {
        window.location.href = urljoin(
          decodeURIComponent(qs.appurl),
          `?token=${encodeURIComponent(token)}`
        );
      }
    };

    firebase.auth().languageCode = "zh-TW";
    getToken();
  }, [location.search]);

  return <div id={captchaDomId}></div>;
};

export default Captcha;
