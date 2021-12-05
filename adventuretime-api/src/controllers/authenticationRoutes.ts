import { Request, Response, Router } from "express";
import authenticate from "../middlewares/authentication";
import parseIdentity from "../middlewares/parseIdentity";
import { controlAdmin } from "../repositories/adminRepo";
import { logConnectedUsers } from "../middlewares/logConnectedUsers";
import { addNewAdmin } from "../logic/adminLogic";


const router = Router();

router.use(authenticate);
router.use(parseIdentity);

router.get("/isAdmin", async (req: Request, res: Response) => {
  const admin: boolean = await controlAdmin(req.identity)
  logConnectedUsers(req.identity)
  return res.json(admin);
})

router.get("/addNewAdmin", async (req: Request, res: Response) => {
  if (!await controlAdmin(req.identity)) { return "401" }
  const newaddedUser = await addNewAdmin(req.query.email, req.identity)
  res.json(newaddedUser)
 }
)




export = router;