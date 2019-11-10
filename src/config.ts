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
    apiKey: "AIzaSyAkf8X85937LOb6LDIx722VSATP5zjre5U",
    authDomain: "milkjobs-staging.firebaseapp.com",
    databaseURL: "https://milkjobs-staging.firebaseio.com",
    projectId: "milkjobs-staging",
    storageBucket: "milkjobs-staging.appspot.com",
    messagingSenderId: "610685322888",
    appId: "1:610685322888:web:0a2c09b362fdd51a2e413d",
    measurementId: "G-7ZT8RVB66E"
  },
  staging: {
    apiKey: "AIzaSyAkf8X85937LOb6LDIx722VSATP5zjre5U",
    authDomain: "milkjobs-staging.firebaseapp.com",
    databaseURL: "https://milkjobs-staging.firebaseio.com",
    projectId: "milkjobs-staging",
    storageBucket: "milkjobs-staging.appspot.com",
    messagingSenderId: "610685322888",
    appId: "1:610685322888:web:0a2c09b362fdd51a2e413d",
    measurementId: "G-7ZT8RVB66E"
  },
  production: {
    apiKey: "AIzaSyDwMvFr2qewsiUhGy-118m6uLDIiDYuGjc",
    authDomain: "milkjobs-production.firebaseapp.com",
    databaseURL: "https://milkjobs-production.firebaseio.com",
    projectId: "milkjobs-production",
    storageBucket: "milkjobs-production.appspot.com",
    messagingSenderId: "1065019619809",
    appId: "1:1065019619809:web:d4e395235f279d63e3baa0",
    measurementId: "G-K02VJE8HVN"
  }
};

export const environment = (process.env.REACT_APP_ENV ||
  "local") as Environment;

export const apiServiceConfig = apiServiceConfigs[environment];
export const algoliaConfig = algoliaConfigs[environment];
export const sentryConfig = sentryConfigs[environment];
export const firebaseConfig = firebaseConfigs[environment];

export const TokenExpiredBufferTime = 3600000;
