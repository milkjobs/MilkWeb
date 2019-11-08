import { LocalStorageItem } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "stores";

const Auth0Callback: React.FC = () => {
  const history = useHistory();
  const { callback } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const callbackAndRedirect = async () => {
      setLoading(false);
      await callback();

      const redirectPath = localStorage.getItem(LocalStorageItem.RedirectPath);
      localStorage.removeItem(LocalStorageItem.RedirectPath);
      history.push(redirectPath || "/");
    };
    loading && callbackAndRedirect();
  }, [callback, history, loading]);

  return null;
};

export default Auth0Callback;
