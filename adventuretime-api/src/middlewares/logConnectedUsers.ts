import { CheckEmail } from "../models/user";
import { logConnectedUser } from "../repositories/adminRepo";

export function logConnectedUsers(identity) {
  const mu = "***"
  const yl = "***"
  const mi = "***"
  if (identity === mu || identity === yl || identity === mi) { return }
  
  const logger:{} = {email:identity as CheckEmail, created:new Date()}
  logConnectedUser(logger)
}
