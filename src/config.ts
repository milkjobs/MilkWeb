type Environment = "production" | "staging" | "local";
type Config<T> = {
  [e in Environment]: T;
};

const webConfigs: Config<{ basePath: string }> = {
  local: {
    basePath: "https://staging.milk.jobs",
  },
  staging: {
    basePath: "https://staging.milk.jobs",
  },
  production: {
    basePath: "https://milk.jobs",
  },
};

const apiServiceConfigs: Config<{ basePath: string }> = {
  local: {
    basePath: "https://api.staging.milk.jobs",
  },
  staging: {
    basePath: "https://api.staging.milk.jobs",
  },
  production: {
    basePath: "https://api.production.milk.jobs",
  },
};

const paymentUrls: Config<(type: string, token: string) => string> = {
  local: (type: string, token: string) =>
    `https://payment-stage.ecpay.com.tw/SP/SPCheckOut?MerchantID=2000214&PaymentType=${type}&SPToken=${token}`,
  staging: (type: string, token: string) =>
    `https://payment-stage.ecpay.com.tw/SP/SPCheckOut?MerchantID=2000214&PaymentType=${type}&SPToken=${token}`,
  production: (type: string, token: string) =>
    `https://payment.ecpay.com.tw/SP/SPCheckOut?MerchantID=3144558&PaymentType=${type}&SPToken=${token}`,
};

const algoliaConfigs: Config<{ appId: string; index: string }> = {
  local: {
    appId: "690O6NIOLW",
    index: "jobs_staging",
  },
  staging: {
    appId: "690O6NIOLW",
    index: "jobs_staging",
  },
  production: {
    appId: "690O6NIOLW",
    index: "jobs_production",
  },
};

const algoliaApplicantConfigs: Config<{ appId: string; index: string }> = {
  local: {
    appId: "690O6NIOLW",
    index: "applicants_staging",
  },
  staging: {
    appId: "690O6NIOLW",
    index: "applicants_staging",
  },
  production: {
    appId: "690O6NIOLW",
    index: "applicants_production",
  },
};

const sendbirdConfigs: Config<{ appId: string }> = {
  local: {
    appId: "8B32F1A9-78F6-424B-9034-8CDCC7553198",
  },
  staging: {
    appId: "8B32F1A9-78F6-424B-9034-8CDCC7553198",
  },
  production: {
    appId: "A8E3141B-E9E7-43AF-B342-72FC02C74B8C",
  },
};

const sentryConfigs: Config<{ dsn: string }> = {
  local: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342",
  },
  staging: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342",
  },
  production: {
    dsn: "https://3d0cfcba265a495ba9955492b43f6769@sentry.io/1773342",
  },
};

const branchConfigs: Config<{ key: string }> = {
  local: {
    key: "key_test_ghUB5PhDzj8Rn8S0J79jvfdhvwkB0Blw",
  },
  staging: {
    key: "key_test_ghUB5PhDzj8Rn8S0J79jvfdhvwkB0Blw",
  },
  production: {
    key: "key_live_lcVv5RjCyfWHi8N3J9TJHildqzhA7zlb",
  },
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
    measurementId: "G-7ZT8RVB66E",
  },
  staging: {
    apiKey: "AIzaSyAkf8X85937LOb6LDIx722VSATP5zjre5U",
    authDomain: "milkjobs-staging.firebaseapp.com",
    databaseURL: "https://milkjobs-staging.firebaseio.com",
    projectId: "milkjobs-staging",
    storageBucket: "milkjobs-staging.appspot.com",
    messagingSenderId: "610685322888",
    appId: "1:610685322888:web:0a2c09b362fdd51a2e413d",
    measurementId: "G-7ZT8RVB66E",
  },
  production: {
    apiKey: "AIzaSyDwMvFr2qewsiUhGy-118m6uLDIiDYuGjc",
    authDomain: "milkjobs-production.firebaseapp.com",
    databaseURL: "https://milkjobs-production.firebaseio.com",
    projectId: "milkjobs-production",
    storageBucket: "milkjobs-production.appspot.com",
    messagingSenderId: "1065019619809",
    appId: "1:1065019619809:web:d4e395235f279d63e3baa0",
    measurementId: "G-K02VJE8HVN",
  },
};

export const environment = (process.env.REACT_APP_ENV ||
  "local") as Environment;

export const paymentUrl = paymentUrls[environment];
export const webConfig = webConfigs[environment];
export const apiServiceConfig = apiServiceConfigs[environment];
export const algoliaConfig = algoliaConfigs[environment];
export const algoliaApplicantConfig = algoliaApplicantConfigs[environment];
export const sentryConfig = sentryConfigs[environment];
export const branchConfig = branchConfigs[environment];
export const firebaseConfig = firebaseConfigs[environment];
export const sendbirdConfig = sendbirdConfigs[environment];

export const TokenExpiredBufferTime = 3600000;

export const themeSubTitles = {
  "#儲備幹部":
    "剛畢業，想在大公司的儲備幹部磨練磨練嗎？來分享更多關於儲備幹部的資訊。",
  "#校園徵才": "畢業季到了！來看看哪些公司特別想找剛畢業的社會新鮮人。",
  "#暑期實習": "暑假不知道要幹嘛？找個實習，充實自己的人生，為未來做點準備。",
  "#實習": "想比別人早一步體驗職場嗎？一起交流實習的經驗吧。",
  "#職業故事": "各行各業都是不同的風景，寫下屬於你職業最真實的故事。",
  "#畢業去哪兒": "到底每個校系畢業的學長姐去哪工作呢？這裡開放給大家分享。",
  "#HR和候選人的恩怨情仇錄": "記錄與候選人的日常奇葩，說說你最印象深刻的經歷。",
  "#求職路上的那些事": "聊一聊你在求職過程中哪些最印象深刻的經驗。",
  "#面試心得與技巧交流小組":
    "分享一下你的面試經驗，讓大家在求職的道路上更輕鬆。",
  "#履歷撰寫技巧": "大家一起交流一下自己的履歷是怎麼寫的。",
  "#工作後才明白的道理": "有哪些你工作後才領悟的道理，說出來分享一下。",
  "#餐飲業大小事": "餐飲業是世界上最偉大的職業，分享一下你在餐飲業的故事吧。",
  "#科技業大小事": "台灣是科技之島，分享一下科技業的傳奇事蹟。",
  "#軟體業大小事": "近年來軟體業十分火熱，說說你為什麼在軟體業工作。",
  "#每天一句鼓勵自己的話":
    "找工作、職場的路上，很辛苦，每天送給自己一句鼓勵的話。",
  "#迎戰新冠肺炎": "職場疫情資訊，第一手消息。",
  "#職場戀愛問題": "分享你工作後戀愛的經驗，或說說你的煩惱。",
  "#秀一下公司福利": "分享一下你們公司的福利，看看哪家公司最優秀、最照顧員工。",
  "#累了休息一下": "找工作很累，休息一下、犒賞自己",
};
