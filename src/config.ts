type Environment = "production" | "staging" | "local";
type Config<T> = {
  [e in Environment]: T;
};

const apiServiceConfigs: Config<{ basePath: string }> = {
  local: {
    basePath: "https://staging.api.milkjobs.ga"
  },
  staging: {
    basePath: "https://staging.api.milkjobs.ga"
  },
  production: {
    basePath: "https://production.api.milkjobs.ga"
  }
};

const auth0Configs: Config<{
  domain: string;
  clientID: string;
  audience: string;
  realm: string;
  responseType: string;
  redirectUri: string;
  logoutReturnTo: string;
  scope: string;
}> = {
  local: {
    domain: "milkjobs-staging.auth0.com",
    clientID: "UBieaJ4Xt4qd5Y8HKDlV45kLlon7MQgJ",
    audience: "https://api.milkjobs.com",
    realm: "Username-Password-Authentication",
    responseType: "token",
    redirectUri: "http://localhost:3000/auth0-callback",
    logoutReturnTo: "http://localhost:3000",
    scope: "openid profile email"
  },
  staging: {
    domain: "milkjobs-staging.auth0.com",
    clientID: "UBieaJ4Xt4qd5Y8HKDlV45kLlon7MQgJ",
    audience: "https://api.milkjobs.com",
    realm: "Username-Password-Authentication",
    responseType: "token",
    redirectUri: "https://staging.milkjobs.ga/auth0-callback",
    logoutReturnTo: "https://staging.milkjobs.ga",
    scope: "openid profile email"
  },
  production: {
    domain: "milkjobs-production.auth0.com",
    clientID: "LlBXdybXFK6t2jek01DXV2vk2y1TqZEt",
    audience: "https://api.milkjobs.com",
    realm: "Username-Password-Authentication",
    responseType: "token",
    redirectUri: "https://milkjobs.ga/auth0-callback",
    logoutReturnTo: "https://milkjobs.ga",
    scope: "openid profile email"
  }
};

const algoliaConfigs: Config<{ appId: string; index: string }> = {
  local: {
    appId: "690O6NIOLW",
    index: "jobs_staging"
  },
  staging: {
    appId: "690O6NIOLW",
    index: "jobs_staging"
  },
  production: {
    appId: "690O6NIOLW",
    index: "jobs_production"
  }
};

const sentryConfigs: Config<{ dsn: string }> = {
  local: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342"
  },
  staging: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342"
  },
  production: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342"
  }
};

const googleAnalyticsConfigs: Config<{ measurementId: string }> = {
  local: {
    measurementId: "G-0Y2XRWQPVS"
  },
  staging: {
    measurementId: "G-0Y2XRWQPVS"
  },
  production: {
    measurementId: "G-0Y2XRWQPVS"
  }
};

const firebaseConfigs: Config<{
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}> = {
  local: {
    apiKey: "AIzaSyC3eTDNRAlQDEeMI-TQM2xe0-vetnkhf3A",
    authDomain: "milkjobs-7938d.firebaseapp.com",
    databaseURL: "https://milkjobs-7938d.firebaseio.com",
    projectId: "milkjobs-7938d",
    storageBucket: "milkjobs-7938d.appspot.com",
    messagingSenderId: "749434492861",
    appId: "1:749434492861:web:e83d0ba9e542ef87c464d4",
    measurementId: "G-5KBC0HVN4F"
  },
  staging: {
    apiKey: "AIzaSyC3eTDNRAlQDEeMI-TQM2xe0-vetnkhf3A",
    authDomain: "milkjobs-7938d.firebaseapp.com",
    databaseURL: "https://milkjobs-7938d.firebaseio.com",
    projectId: "milkjobs-7938d",
    storageBucket: "milkjobs-7938d.appspot.com",
    messagingSenderId: "749434492861",
    appId: "1:749434492861:web:e83d0ba9e542ef87c464d4",
    measurementId: "G-5KBC0HVN4F"
  },
  production: {
    apiKey: "AIzaSyC3eTDNRAlQDEeMI-TQM2xe0-vetnkhf3A",
    authDomain: "milkjobs-7938d.firebaseapp.com",
    databaseURL: "https://milkjobs-7938d.firebaseio.com",
    projectId: "milkjobs-7938d",
    storageBucket: "milkjobs-7938d.appspot.com",
    messagingSenderId: "749434492861",
    appId: "1:749434492861:web:e83d0ba9e542ef87c464d4",
    measurementId: "G-5KBC0HVN4F"
  }
};

export const environment = (process.env.REACT_APP_ENV ||
  "local") as Environment;

export const apiServiceConfig = apiServiceConfigs[environment];
export const auth0Config = auth0Configs[environment];
export const algoliaConfig = algoliaConfigs[environment];
export const sentryConfig = sentryConfigs[environment];
export const googleAnalyticsConfig = googleAnalyticsConfigs[environment];
export const firebaseConfig = firebaseConfigs[environment];

export const TokenExpiredBufferTime = 3600000;
