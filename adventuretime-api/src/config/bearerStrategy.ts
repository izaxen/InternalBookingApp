import adalConfig from "./adal";
import logger from "../logger";
import {
  ITokenPayload,
  VerifyCallback,
  BearerStrategy,
  IBearerStrategyOption,
} from "passport-azure-ad";

const bearerStrategyConfig: IBearerStrategyOption = {
  identityMetadata: adalConfig.identityMetadata,
  clientID: adalConfig.clientID,
  validateIssuer: adalConfig.validateIssuer,
  issuer: adalConfig.issuer,
  isB2C: adalConfig.isB2C,
  allowMultiAudiencesInToken: adalConfig.allowMultiAudiencesInToken,
  audience: adalConfig.audience,
};

const bearerVerifyer = (token: ITokenPayload, done: VerifyCallback) => {
  logger.info({ email: token.preferred_username }, "Autentication");

  if (token.oid) {
    done(null, token);
  } else {
    done(new Error("oid is not found in token"));
  }
};





const bearerStrategy = new BearerStrategy(bearerStrategyConfig, bearerVerifyer);

export default bearerStrategy;