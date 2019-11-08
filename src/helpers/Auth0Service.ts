import { Auth0DecodedHash, WebAuth } from "auth0-js";
import { auth0Config } from "config";
import JwtDecode from "jwt-decode";

type JwtToken = {
  aud: string;
  azp: string;
  exp: number;
  iss: string;
  sub: string;
};

export default class Auth0Service {
  auth0: WebAuth;

  constructor() {
    this.auth0 = new WebAuth(auth0Config);
  }

  validateAccessToken = (rawToken?: string | null) => {
    try {
      if (!rawToken) {
        return;
      }

      const token = JwtDecode<JwtToken>(rawToken);
      if (
        (Array.isArray(token.aud)
          ? token.aud.includes(auth0Config.audience)
          : token.aud === auth0Config.audience) &&
        token.azp === auth0Config.clientID &&
        new URL(token.iss).hostname === auth0Config.domain &&
        token.exp > Date.now() / 1000
      ) {
        return token.sub;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // https://auth0.com/docs/api-auth/tutorials/silent-authentication
  renewAccessToken = () => {
    return new Promise((resolve: (accessToken: string) => void, reject) => {
      this.auth0.checkSession({}, (e, res: Auth0DecodedHash) => {
        if (e || !res || !res.accessToken) {
          console.error(e);
          reject(e);
        } else {
          resolve(res.accessToken);
        }
      });
    });
  };

  parseUrlHash = () => {
    return new Promise((resolve: (accessToken: string) => void, reject) => {
      this.auth0.parseHash((e, res) => {
        if (e || !res || !res.accessToken) {
          console.error(e);
          reject(e);
        } else {
          resolve(res.accessToken);
        }
      });
    });
  };

  // https://auth0.com/docs/api/authentication#signup
  signup = ({
    username,
    password,
    name,
    email
  }: {
    username: string;
    password: string;
    name: string;
    email: string;
  }) => {
    return new Promise((resolve, reject) => {
      try {
        this.auth0.signup(
          {
            connection: auth0Config.realm,
            username,
            email,
            password: password,
            // eslint-disable-next-line @typescript-eslint/camelcase
            user_metadata: { name } // For post-registration hook use.
          },
          (e, res) => {
            if (e || !res) {
              console.error(e);
              reject(e);
            } else {
              resolve();
            }
          }
        );
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  // https://auth0.com/docs/cross-origin-authentication
  login = ({ username, password }: { username: string; password: string }) => {
    return new Promise((resolve, reject) => {
      try {
        this.auth0.login({ username, password, scope: "milk" }, e => {
          if (e) {
            console.error(e);
            reject(e);
          } else {
            resolve();
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  // https://auth0.com/docs/api/authentication#logout
  logout = () => {
    this.auth0.logout({
      clientID: auth0Config.clientID,
      returnTo: auth0Config.logoutReturnTo
    });
  };
}
