import { Query, DocumentData, DocumentReference, DocumentSnapshot } from "@google-cloud/firestore";

import db from '../database';

async function create(name: string, object: DocumentData): Promise<DocumentReference> {
  try {
    return await db.collection(name).add({...object}); // Read https://stackoverflow.com/questions/52221578/firestore-doesnt-support-javascript-objects-with-custom-prototypes
  } catch (e) {
    console.log("E", e)
    throw new Error(`Could not create object for collection ${name} ${e}`);
  }
}

async function createWithId(name: string, id: string, object: DocumentData): Promise<DocumentReference> {
  try {
    const ref: DocumentReference = await db.collection(name).doc(id);
    await ref.set({...object})
    return ref;
  } catch (e) {
    console.log("E", e)
    throw new Error(`Could not sett object for collection ${name} ${e}`);
  }
}

async function readOne(name: string, id: string): Promise<DocumentReference> {
  try {
    const ref: DocumentReference = await db.collection(name).doc(id);
    const snap: DocumentSnapshot = await ref.get();
    if (!snap.exists) {
      return null;
    }
    return ref;
  } catch (e) {
    throw new Error(`Could not read object for collection ${name} ${e}`);
  }
}

async function readOrCreateWithId(name: string, id: string, object: DocumentData): Promise<DocumentReference> {
  try {
    const ref: DocumentReference = await readOne(name, id);
    if (!ref) {
      return await createWithId(name, id, object)
    }
    return ref;
  } catch (e) {
    console.log("E", e)
    throw new Error(`Could not sett object for collection ${name} ${e}`);
  }
}


async function readWhere(name: string, fieldPath: string, opStr: FirebaseFirestore.WhereFilterOp, value: any): Promise<DocumentReference> {
  try {
    const collection: Query<DocumentData> = db.collection(name);
    const ref: DocumentData = collection.where(fieldPath, opStr, value);
    const snap = await ref.get();
    if (snap.empty) return null;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as DocumentReference)
  } catch (e) {
    throw new Error(`Could not read object for collection ${name} ${e}`);
  }
}


async function update(name: string, id: string, object: DocumentData): Promise<DocumentReference> {
  try {
    const ref: DocumentReference = db.collection(name).doc(id);
    const snap: DocumentSnapshot = await ref.get();
    if (!snap.exists) {
      return ref;
    }
    await ref.update(object);
    return ref;
  } catch (e) {
    throw new Error(`Could not update object for collection ${name} ${e}`);
  }
}

async function readAll(name: string): Promise<DocumentReference[]> {
  try {
    return await db.collection(name).listDocuments();
  } catch (e) {
    throw new Error(`Could not read all object for collection ${name} ${e}`);
  }
}

async function deleteOne(name: string, id: string): Promise<DocumentReference> {
  try {
    const ref: DocumentReference = db.collection(name).doc(id);
    await ref.delete();
    return ref;
  } catch (e) {
    throw new Error(`Could not delete object for collection ${name} ${e}`);
  }
}


export {
  create,
  createWithId,
  readOne,
  readOrCreateWithId,
  readAll,
  deleteOne,
  update,
  readWhere
}