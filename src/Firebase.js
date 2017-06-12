import * as firebase from 'firebase'

let database

export const firebaseInit = configenv => {
  const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET
  }
  firebase.initializeApp(config)
  database = firebase.database()
}

export const getMessages = () => {
  return database.ref('/messages/').once('value')
}
