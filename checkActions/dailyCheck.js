const constants = require('../module/constants')
const oneDayUTC = 86400000
const { google } = require('googleapis')
const errorHandler = require('./errorHandler')


dailySlotsCheck = (events, dayStart) => {
  const courseSlots = [...constants.slotsTimes.courseSlots]
  events.map((event, i) => {    
    const start = event.start.dateTime || event.start.date
    if ((Date.parse(start) - dayStart) < oneDayUTC && Date.parse(start) >= dayStart) {
      startTime = new Date(start).toISOString()
      startTime = `${startTime.slice(11, 19)}`
      courseSlots.map((courseTime, i_start) => {
        if (startTime === courseTime.startTime) {
          courseSlots.splice(i_start, 1)
        }
      })
    }
  })
  return courseSlots
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

exports.listDailyEvents = async (auth, date) => {
  const isInputValid = errorHandler.errorDateHandler( date, 'dailyCheck')
  if( isInputValid !== 'valid' ) return isInputValid
  return new Promise((resolve, reject) => {
    listParams = {
      calendarId: 'primary',
      timeMin: new Date(Date.UTC(date.year, date.month - 1, date.day, 9)),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime'
    }
    td = new Date()
    const minToday = new Date(Date.UTC(td.getUTCFullYear(), td.getUTCMonth(), td.getUTCDate(), 9))     
    if (
      listParams.timeMin.getUTCDay() === 6 ||
      listParams.timeMin.getUTCDay() === 0 ||
      listParams.timeMin < minToday){
        resolve({ success: false, timeSlots: [] })
      }
    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      const events = res.data.items
      resolve(checkDailySchedule(events, date))
    })
  })
}

