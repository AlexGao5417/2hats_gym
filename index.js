const express = require('express')
const app = express()
const utilities = require('./utilities')

app.get('/days', async (req, res) => {
  const date = {
    year: req.query.year,
    month: req.query.month
  }
  const result = await utilities.authenticate(date, utilities.listMonthEvents, res)
  res.send(result)
})

app.get('/timeslots', async (req, res) => {
  const date = {
    year: req.query.year,
    month: req.query.month,
    day: req.query.day
  }
  const result = await utilities.authenticate(date, utilities.listDailyEvents, res)
  res.send(result)
})

app.post('/book', async (req, res) => {
  const booking = {
    year: req.query.year,
    month: req.query.month,
    day: req.query.day,
    hour: req.query.hour,
    minute: req.query.minute
  }
  const result = await utilities.authenticate(booking, utilities.postNewEvent, res)
  res.send(result)
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
