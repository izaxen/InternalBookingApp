import { AddNewAdminDTO } from "../models/user";
import { addAdmin, controlAdmin } from "../repositories/adminRepo";

export async function addNewAdmin(newAdmin: any, adminUser:any) {
  if (await controlAdmin(newAdmin)) { return "Admin already existing" }
  
  const createAdmin:AddNewAdminDTO = {
    admin: newAdmin as string, created: new Date(), createdBy:adminUser
  }
  return addAdmin(createAdmin);
}