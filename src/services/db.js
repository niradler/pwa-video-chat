import {firebase_config} from '../config';
import firebase from 'firebase';

firebase.initializeApp(firebase_config);
const db = firebase.database();

export const withRef = (ref) => db.ref(ref);

export default db;