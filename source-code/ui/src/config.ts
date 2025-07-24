declare global {
  interface Window {
    RUNTIME_CONFIG?: { API_URL?: string; IMAGE_BUCKET_URL?: string };
  }
}

export const API_URL = window?.RUNTIME_CONFIG?.API_URL;

export const IMAGE_BUCKET_URL = window?.RUNTIME_CONFIG?.IMAGE_BUCKET_URL;
