const fs = require('fs')
const { google } = require('googleapis')
const TOKEN_PATH = 'token.json'
const constants = require('../module/constants')
const errorHandler = require('./errorHandler')

exports.listMonthEvents = async (auth, date) => {
  const isInputValid = errorHandler.errorDateHandler( date, 'monthlyCheck')
  if( isInputValid !== 'valid' ) return isInputValid
  return new Promise((resolve, reject) => {
    listParams = {
      calendarId: 'primary',
      timeMin: new Date(Date.UTC(date.year, date.month - 1, 1, 9)).toISOString(),
      maxResults: 1000,
      singleEvents: true,
      orderBy: 'startTime'
    }
    const monthlySchedule = { success: false, days: [] }
    const t = new Date()
    const thisMonth = Date.UTC(t.getUTCFullYear(), t.getMonth(), 1, 9)
    if(Date.parse(listParams.timeMin) < thisMonth) resolve(monthlySchedule)
    
    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      const events = res.data.items
      resolve(checkMonthlySchedule(events, date))
    })
  })
}

checkMonthlySchedule = (events, date) => {
  const monthlySchedule = { success: false, days: [] }
  const monthSlots = new Object()
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
    const occupiedSlots = monthSlots[key].length
    const hasTimeSlots = occupiedSlots < 12
    if (hasTimeSlots) { monthlySchedule.success = true }
    monthlySchedule.days.push({"day": Number(key),  "hasTimeSlots": hasTimeSlots })
  }

  return monthlySchedule
}


