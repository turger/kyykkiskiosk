import slack from 'slack'

const SECONDS_IN_DAY = 86400
const SLACK_TOKEN = process.env.REACT_APP_SLACK_TOKEN

export const getTimeIfMoreThan60min = (minutesToDeparture, departureTimestamp) => {
  if (minutesToDeparture >= 60) {
    const depDate = new Date(departureTimestamp * 1000)
    const hours = depDate.getUTCHours()
    const minutes = ('0' + depDate.getUTCMinutes()).slice(-2)
    return `${hours}:${minutes}`
  } else {
    return `${minutesToDeparture} min`
  }
}

const getStartOfDay = (time = new Date()) => {
  const newTime = new Date(time.getTime())
  newTime.setHours(0, 0, 0, 0)
  return newTime.getTime()
}

const getTimeInSeconds = (time = new Date()) => (time.getHours()*60*60) + (time.getMinutes()*60) + time.getSeconds()

export const minutesToDeparture = (stopTime, time = new Date()) => {
  const timeInSeconds = getTimeInSeconds(time)
  const startOfDayInSeconds = getStartOfDay(time) / 1000

  let arrivalTimeInSeconds
  if (stopTime.serviceDay > startOfDayInSeconds) {
    // if service day is next day
    arrivalTimeInSeconds = stopTime.realtimeArrival + SECONDS_IN_DAY
  } else if (stopTime.realtimeArrival-timeInSeconds > SECONDS_IN_DAY) {
    // else if stopTime.realtimeArrival is more than 24h, this happens between 00:00-06:00
    arrivalTimeInSeconds = stopTime.realtimeArrival - SECONDS_IN_DAY
  } else {
    arrivalTimeInSeconds = stopTime.realtimeArrival
  }

  const minutesToDeparture = Math.floor((arrivalTimeInSeconds - timeInSeconds) / 60)

  return minutesToDeparture
}

export const getEmojiList = () => new Promise(resolve => {
  slack.emoji.list({ token: SLACK_TOKEN }, (err, data) => {
    resolve(data.emoji)
  })
})

export const cleanupMessage = (message, emojiList) => {
  let newContent = message.content
  const emojis = []
  const images = []
  const urlMatches = newContent.match(/\bhttps?:\/\/\S+/gi)
  const emojiMatches = newContent.match(/(:(\w|-)*:)/gi)

  if (urlMatches) {
    urlMatches.forEach(url => {
      newContent = newContent.replace(url, '')
      images.push(url)
    })
  }

  if (emojiMatches) {
    emojiMatches.forEach(emoji => {
      const emojiName = emoji.replace(/:/gi, '')
      newContent = newContent.replace(emoji, '')
      if (emojiList[emojiName]) {
        emojis.push(emojiList[emojiName])
      }
    })
  }

  newContent = newContent.replace(/\*/gi, '')

  return {
    ...message,
    content: newContent.trim(),
    emojis,
    image: images[0],
  }
}
