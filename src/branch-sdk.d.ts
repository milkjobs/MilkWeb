declare module "branch-sdk" {
  interface InitOptions {
    branch_match_id?: string;
    branch_view_id?: string;
    no_journeys?: boolean;
    disable_entry_animation?: boolean;
    disable_exit_animation?: boolean;
    retries?: number;
    retry_delay?: number;
    timeout?: number;
    metadata?: any;
    nonce?: string;
    tracking_disabled?: boolean;
  }

  interface InitData {
    data_parsed?: any;
    referring_identity?: string;
    has_app?: boolean;
    identity?: string;
    "~referring_link"?: string;
  }

  interface SetIdentityData {
    identity_id?: string;
    link?: string;
    referring_data_parsed?: any;
    referring_identity?: string;
  }

  interface SendSMSOptions {
    make_new_link?: boolean;
  }

  interface LinkData {
    $canonical_url?: string;
    $deeplink_path?: string;
    $desktop_url?: string;
    $ios_url?: string;
  }

  type ErrorCallback = (error: string | null) => void;
  type InitCallback = (error: string | null, data: InitData) => void;
  type SetIdentityCallback = (error: string | null, data: InitData) => void;

  interface BranchStatic {
    init: (key: string, options?: InitOptions, callback?: InitCallback) => void;
    setIdentity: (identity: string, callback?: SetIdentityCallback) => void;
    logout: (callback?: ErrorCallback) => void;
    sendSMS: (
      phone: string,
      linkData: LinkData,
      options?: SendSMSOptions,
      callback?: ErrorCallback
    ) => void;
    link: any;
  }

  const branch: BranchStatic;

  export default branch;
}
