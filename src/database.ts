import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

export default db;