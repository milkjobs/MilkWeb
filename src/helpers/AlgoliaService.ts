import {
  AlgoliaCredentialFromJSON,
  AlgoliaCredentialToJSON,
  UserApi,
} from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { TokenExpiredBufferTime } from "config";
import { LocalStorageItem } from "helpers";

class AlgoliaService {
  userId: string;
  userApi: UserApi;

  constructor(userId: string, userApi: UserApi) {
    this.userId = userId;
    this.userApi = userApi;
  }

  getApiKey = async () => {
    let credential = await this.getCredential();
    if (
      credential &&
      credential.expiresAt.getTime() >
        new Date().getTime() + TokenExpiredBufferTime
    ) {
      return credential.apiKey;
    }

    credential = await this.refreshCredential();

    return credential ? credential.apiKey : "";
  };

  private getCredential = async () => {
    const algoliaCredential = localStorage.getItem(
      LocalStorageItem.AlgoliaCredential
    );
    if (algoliaCredential) {
      return AlgoliaCredentialFromJSON(JSON.parse(algoliaCredential));
    }
  };

  private refreshCredential = async () => {
    const [, algoliaCredential] = await to(
      this.userApi.getAlgoliaCredential({ userId: this.userId })
    );
    if (algoliaCredential) {
      localStorage.setItem(
        LocalStorageItem.AlgoliaCredential,
        JSON.stringify(AlgoliaCredentialToJSON(algoliaCredential))
      );
      return algoliaCredential;
    }
  };
}

export { AlgoliaService };
