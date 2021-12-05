import { Firestore } from "@google-cloud/firestore";

export default class EventRepo {

  private db = new Firestore();
  private eventRef = this.db.collection('event');

  constructor() {
    this.firestoreSettings()
  }

  private firestoreSettings() {
    this.db.settings({
      ignoreUndefinedProperties: true
    });
  }

  async getEvents() {
    const docs = await this.eventRef.get()
    let eventsList: object[] = []

    docs.forEach(doc => {
      let id: string = doc.id
      eventsList.push({ ...doc.data(), id })
    })

    return eventsList;
  }
  async getEvent(id: string) {
    return (await this.eventRef.doc(id).get()).data();
  }

  async updateEvent(id: string, event: FirebaseFirestore.DocumentData) {
    let document = this.eventRef.doc(id);
    if (document) {
      document.update(event)
    }
  }

}
