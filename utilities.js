const fs = require('fs')
const { google } = require('googleapis')
const TOKEN_PATH = 'token.json'
const constants = require('./module/constants')
const oneDayUTC = 86400000

dailySlotsCheck = (events, dayStart) => {
  const courseSlots = [...constants.slotsTimes.courseSlots]
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date
    if ((Date.parse(start) - dayStart) < oneDayUTC) {
      startTime = `${start.slice(11, 19)}`
      courseSlots.map((courseTime, i_start) => {
        if (startTime === courseTime.startTime) {
          courseSlots.splice(i_start, 1)
        }
      })
    }
  })
  return courseSlots
}

checkMonthlySchedule = (events, date) => {
  const monthlySchedule = { success: false, days: [] }
  const monthSlots = new Object()
  // 2019-09-13T12:00:00+10:00 event
  const dayInMonth = new Date(date.year, date.month, 0).getDate()
  for (let dayCount = 1; dayCount <= dayInMonth; dayCount++) {
    monthSlots[dayCount] = []
  }
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date
    const startTime = Date.parse(new Date(start))
    for (let dayCount = 1; dayCount <= dayInMonth; dayCount++) {
      const dayStart = new Date(Date.UTC(date.year, date.month - 1, dayCount, 9))
      const dayEnd = new Date(Date.UTC(date.year, date.month - 1, dayCount, 18))
      if (startTime >= dayStart && startTime < dayEnd) {
        monthSlots[dayCount].push(start)
      }
    }
  })

  for (key in monthSlots) {
    const freeSlots = monthSlots[key].length
    const hasTimeSlots = freeSlots < 12
    if (hasTimeSlots) { monthlySchedule.success = true }
    monthlySchedule.days.push(`{"day": ${key},  "hasTimeSlots": ${hasTimeSlots} }`)
  }

  return monthlySchedule
}

checkDailySchedule = (events, date) => {
  const dayStart = new Date(Date.UTC(date.year, date.month - 1, date.day, 9))
  const returnSlots = { success: false, timeSlots: [] }
  const courseSlots = dailySlotsCheck(events, dayStart)
  if (!courseSlots[0]) { return returnSlots };
  returnSlots.success = true
  courseSlots.map((courseTime, i) => {
    const startHour = courseTime.startTime.slice(0, 2)
    const startMinute = courseTime.startTime.slice(3, 5)
    const endHour = courseTime.endTime.slice(0, 2)
    const endMinute = courseTime.endTime.slice(3, 5)
    returnSlots.timeSlots.push(
      {
        startTime: new Date(Date.UTC(date.year, date.month - 1, date.day, startHour, startMinute)).toISOString(),
        endTime: new Date(Date.UTC(date.year, date.month - 1, date.day, endHour, endMinute)).toISOString()
      }
    )
  })
  return returnSlots
}

exports.listMonthEvents = async (auth, date) => {
  return new Promise((resolve, reject) => {
    if (errorDateHandler(resolve, date, 'monthlyCheck')) return
    // use this params if we need check for one month
    listParams = {
      calendarId: 'primary',
      timeMin: new Date(Date.UTC(date.year, date.month - 1, 1, 9)).toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: 'startTime'
    }
    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      const events = res.data.items
      resolve(checkMonthlySchedule(events, date))
    })
  })
}

exports.listDailyEvents = async (auth, date) => {
  return new Promise((resolve, reject) => {
    if (errorDateHandler(resolve, date, 'dailyCheck')) return
    listParams = {
      calendarId: 'primary',
      timeMin: new Date(Date.UTC(date.year, date.month - 1, date.day)),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime'
    }

    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      const events = res.data.items
      resolve(checkDailySchedule(events, date))
    })
  })
}

exports.postNewEvent = async (auth, date) => {
  return new Promise((resolve, reject) => {
    // error handling
    if (errorDateHandler(resolve, date, 'postNewEvent')) return
    // const lagAdjust = constants.constants.lagAdjust
    const fourtyMinutes = constants.constants.fourtyMinutesUTC
    const startTime = new Date(Date.UTC(date.year, date.month - 1, date.day, date.hour, date.minute))

    const endTime = new Date(Date.parse(startTime) + fourtyMinutes)
    // // add 10 hours to get ISO time
    // const startTimeAdjust = new Date(Date.parse(startTime) + lagAdjust)
    // const endTimeAdjust = new Date(Date.parse(startTimeAdjust) + fourtyMinutes)
    const today = new Date()
    event = {
      start: { dateTime: `${startTime.toISOString()}` },
      end: { dateTime: `${endTime.toISOString()}` }
    }
    listParams = { calendarId: 'primary', resource: event }
    const calendar = google.calendar({ version: 'v3', auth })

    if (!constants.startTimeSlots.includes(`${startTime.toISOString().slice(11, 19)}`)) {
      resolve({
        success: false,
        message: 'Invalid time slot'
      })
      return
    }
    if (startTime < today) {
      resolve({
        success: false,
        message: 'Cannot book time in the past'
      })
      return
    }
    if ((startTime - today) < constants.constants.oneDayUTC) {
      resolve({
        success: false,
        message: 'Cannot book with less than 24 hours in advance'
      })
      return
    }
    if (startTime.getUTCHours() > 17 || startTime.getUTCHours() < 9) {
      resolve({
        success: false,
        message: 'Cannot book outside bookable timeframe'
      })
      return
    }
    let result = null
    calendar.events.insert(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      result = {
        success: true,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime
      }
      resolve(result)
    })
  })
}

errorDateHandler = (resolve, date, type) => {
  if (date.month === 'undefined') {
    resolve({
      success: false,
      message: 'Request is missing parameter: month'
    })
    return true
  }
  if (date.year === 'undefined') {
    resolve({
      success: false,
      message: 'Request is missing parameter: year'
    })
    return true
  }
  if (type === 'monthlyCheck') return false
  if (date.day === 'undefined') {
    resolve({
      success: false,
      message: 'Request is missing parameter: day'
    })
    return true
  }
  if (type === 'dailyCheck') return false
  if (date.minute === 'undefined') {
    resolve({
      success: false,
      message: 'Request is missing parameter: minute'
    })
    return true
  }
  return false
}

exports.authenticate = async (date, action) => {
  let result = null
  return new Promise((resolve, reject) => {
    fs.readFile('credentials.json', async (err, content) => {
      if (err) reject('Error loading client secret file:', err)
      // Authorize a client with credentials, then call the Google Calendar API.
      const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0])

      // Check if we have previously stored a token.
      await fs.readFile(TOKEN_PATH, async (err, token) => {
        if (err) reject(oAuth2Client, () => { console.log(err) })
        oAuth2Client.setCredentials(JSON.parse(token))
        result = await action(oAuth2Client, date)
        resolve(result)
      })
    })
  })
}
