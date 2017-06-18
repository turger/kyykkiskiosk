import firebase from 'firebase'
import { cleanupMessage, getEmojiList } from '../utils'

const config = {
  '🔥': {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  }
}

if ( !firebase.apps.length ) firebase.initializeApp(config['🔥'])

export default firebase

const MESSAGES_REF = firebase.database().ref('messages').orderByChild("unixTimeStamp").limitToLast(1)

export const pollMessages = callback => new Promise(() => {
  MESSAGES_REF.off('value')

  getEmojiList().then(emojis => {
    MESSAGES_REF.on('value', snapshot => {
      const messages = snapshot.val()
      callback(Object.keys(messages).map(id => {
        const message = messages[id]
        message.id = id
        return cleanupMessage(message, emojis)
      }))
    })
  })
})

export const stopPollMessages = () => {
  MESSAGES_REF.off('value')
}
