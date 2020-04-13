export enum LocalStorageItem {
  AlgoliaCredential = "AlgoliaCredential",
  SendbirdCredential = "SendbirdCredential",
}

export interface ApplicationMetaData {
  jobId: string;
  applicantId: string;
}

export enum MobileOS {
  WindowsPhone,
  Android,
  Ios,
}

export enum AlertType {
  NotVerification,
  NoVisitorsToBe,
  NoResume,
}

export enum PurchaseMethod {
  Credit = "Credit",
  ATM = "ATM",
}
