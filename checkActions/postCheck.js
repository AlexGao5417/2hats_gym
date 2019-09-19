const constants = require('../module/constants')
const { google } = require('googleapis')
const dailyCheck = require('./dailyCheck')
const errorHandler = require('./errorHandler')


exports.postNewEvent = async (auth, date) => {
  const isInputValid = errorHandler.errorDateHandler( date, null)
  if( isInputValid !== 'valid' ) return isInputValid
  let availableStartTimeList = []
  const availableEvents = await dailyCheck.listDailyEvents( auth , date )
  availableEvents.timeSlots.map((eventTime,i)=>{
    availableStartTimeList.push(eventTime.startTime);
  })
  
  return new Promise((resolve, reject) => {
    const today = new Date()
    const fourtyMinutes = constants.constants.fourtyMinutesUTC
    const startTime = new Date(Date.UTC(date.year, date.month - 1, date.day, date.hour, date.minute))
    const endTime = new Date(Date.parse(startTime) + fourtyMinutes)
    //event must be const!!! otherwise when there are multiple calls come in, the late request 
    //will have replace the previous event, which will result in that all the responses will   
    //be the same as the latest response.
    const event = {
      start: { dateTime: `${startTime.toISOString()}` },
      end: { dateTime: `${endTime.toISOString()}` }
    }    
    if (startTime < today) {
      resolve({
        success: false,
        message: "Cannot book time in the past"
      })
    }
    if ((startTime - today) < constants.constants.oneDayUTC) {
      resolve({
        success: false,
        message: "Cannot book with less than 24 hours in advance"
      })
    }
    if (
      startTime.getUTCHours() > 17 ||
      startTime.getUTCHours() < 9 ||
      startTime.getUTCDay() === 6 ||
      startTime.getUTCDay() === 0
    ) {
      resolve({
        success: false,
        message: "Cannot book outside bookable timeframe"
      })
    }

    listParams = { calendarId: 'primary', resource: event }
    const calendar = google.calendar({ version: 'v3', auth })
    if(!availableStartTimeList.includes(startTime.toISOString())){
      resolve({
        success: false,
        message: "Invalid time slot"
      })
      return
    }
    calendar.events.insert(listParams, (err, res) => {
      if (err) reject({
        success: false,
        message: 'The API returned an error: ' + err
      })      
      result = {
        success: true,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime
      }      
      resolve(result)
    })
  })
}


