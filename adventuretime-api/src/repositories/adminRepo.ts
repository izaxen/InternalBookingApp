import { Firestore } from "@google-cloud/firestore";
import { AddNewAdminDTO } from "../models/user";


const db = new Firestore();
db.settings({
  ignoreUndefinedProperties: true
});
const adminRef = db.collection('admins');
const userLog = db.collection('connectedUsers');


export async function controlAdmin(identity: string) {
  const snapshot = await adminRef.where('admin', '==', identity).get();
  return snapshot.size > 0;
}

export function logConnectedUser(userData) {
  userLog.doc().create(userData);
}

export async function addAdmin(admin:AddNewAdminDTO) {
  const adminRefData = adminRef.doc();
  let dbResponse:string = "";

  await adminRefData.create(admin).then((res) => {
    dbResponse = `Admin ${admin.admin} created at ${res.writeTime.toDate()}`;
  }).catch((err) => {
    dbResponse=`Failed to create document: ${err}`
  })
  return dbResponse
}



