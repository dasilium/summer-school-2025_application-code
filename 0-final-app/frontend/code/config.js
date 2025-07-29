const IMAGE_BUCKET_NAME = "summer-school-app-images-2";
const IMAGE_BUCKET_REGION = "eu-central-1"; //
const API_URL = "https://g87y0bgivi.execute-api.eu-central-1.amazonaws.com";

window.RUNTIME_CONFIG = {
  API_URL,
  IMAGE_BUCKET_URL: `https://${IMAGE_BUCKET_NAME}.s3.${IMAGE_BUCKET_REGION}.amazonaws.com`,
  AUTHORITY:
    "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_6b9tgwk3p",
  CLIENT_ID: "1m34r9s4pckilq3mnsqe8flgku",
  REDIRECT_URI: "https://d2qxk9l6qj3ezz.cloudfront.net/redirect",
  USER_POOL_DOMAIN:
    "https://eu-central-16b9tgwk3p.auth.eu-central-1.amazoncognito.com",
  SIGN_OUT_URL: "https://d2qxk9l6qj3ezz.cloudfront.net/logout",
};
