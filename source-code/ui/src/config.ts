declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      API_URL?: string;
      IMAGE_BUCKET_URL?: string;
      AUTHORITY?: string;
      CLIENT_ID?: string;
      REDIRECT_URI?: string;
      USER_POOL_DOMAIN?: string;
      SIGN_OUT_URL?: string;
    };
  }
}

export const API_URL = window?.RUNTIME_CONFIG?.API_URL;
export const IMAGE_BUCKET_URL = window?.RUNTIME_CONFIG?.IMAGE_BUCKET_URL;
export const AUTHORITY = window?.RUNTIME_CONFIG?.AUTHORITY;
export const CLIENT_ID = window?.RUNTIME_CONFIG?.CLIENT_ID;
export const REDIRECT_URI = window?.RUNTIME_CONFIG?.REDIRECT_URI;
export const USER_POOL_DOMAIN = window?.RUNTIME_CONFIG?.USER_POOL_DOMAIN;
export const SIGN_OUT_URL = window?.RUNTIME_CONFIG?.SIGN_OUT_URL;
