const { google } = require('googleapis')
const errorHandler = require('./errorHandler')
const constants = require('../module/constants')

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
    const calendar = google.calendar({ version: 'v3', auth })
    calendar.events.list(listParams, (err, res) => {
      if (err) reject('The API returned an error: ' + err)
      const events = res.data.items
      resolve(checkMonthlySchedule(events, date))
    })
  })
}

checkMonthlySchedule = (events, date) => {
  const today = new Date()
  const placeHodler = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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
      //make sure the length of the date in the past, the date in 24 hours from now, the date which is
      // a weekend day are over 12 so that it will return false for "hasTimeSlots"
      if (Date.parse(dayEnd) <= Date.parse(today) + constants.constants.oneDayUTC ||
          dayEnd.getUTCDay() === 6 ||
          dayEnd.getUTCDay() === 0) {  
        monthSlots[dayCount] = placeHodler        
        continue
      }
      if (startTime >= dayStart && startTime < dayEnd) {
        monthSlots[dayCount].push(start)
      }
    }    
  })

  for (key in monthSlots) {
    //Since for each day the maximum booking slots is 12, so if the occupiedSlots is over 12 that means 
    //there is no availble slot for another booking. 
    const occupiedSlots = monthSlots[key].length
    
    const hasTimeSlots = occupiedSlots < 12
    if (hasTimeSlots) { monthlySchedule.success = true }
    monthlySchedule.days.push({"day": Number(key),  "hasTimeSlots": hasTimeSlots })
  }

  return monthlySchedule
}


