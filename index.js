const express = require('express')
const app = express()
const dailyCheck = require('./checkActions/dailyCheck')
const monthlyCheck = require('./checkActions/monthlyCheck')
const postCheck = require('./checkActions/postCheck')
const authentication = require('./authentication') 




app.get('/days', async (req, res) => {
  auth = await authentication.getAuth()
  const date = {
    year: req.query.year,
    month: req.query.month
  }
  const result = await monthlyCheck.listMonthEvents(auth, date)
  res.send(result)
})


app.get('/timeslots', async (req, res) => {
  auth = await authentication.getAuth()
    const date = {
    year: req.query.year,
    month: req.query.month,
    day: req.query.day
  }
  const result = await dailyCheck.listDailyEvents(auth, date)
  res.send(result)
})


app.post('/book', async (req, res) => {
  a = new Date()
  
  console.log("book start time: " + `${a.getMinutes()}:${a.getSeconds()}:${a.getMilliseconds()}`);
  
  auth = await authentication.getAuth()
  const booking = {
    year: req.query.year,
    month: req.query.month,
    day: req.query.day,
    hour: req.query.hour,
    minute: req.query.minute
  } 
  console.log(booking); 
  try{
    const result = await postCheck.postNewEvent(auth, booking)
    res.send(result)
  }
  catch(err){
    res.send(err)}
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
