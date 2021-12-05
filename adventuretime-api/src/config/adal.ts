const adalConfig = {
  identityMetadata:
    "https://login.microsoftonline.com/common/.well-known/openid-configuration",
  clientID: ******
  validateIssuer: true,
  issuer: [
    *****
  ],
  isB2C: false,
  audience: "",
  allowMultiAudiencesInToken: false,
};

export default adalConfig;