const app = require('axios')

postTest = (year,month,day,hour,minute) => app.post(`http://localhost:8080/book?year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}`)
  .then(
    (res) => {
      console.log(res.data)
    })
  .catch((error) => {
    console.error(error)
  })

dailyTest = (year,month,day) => app.get(`http://localhost:8080/timeslots?year=${year}&month=${month}&day=${day}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

monthlyTest = (year,month) => app.get(`http://localhost:8080/days?year=${year}&month=${month}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

// dailyTest(2019,10,2)
postTest(2019,10,2,10,30)
// monthlyTest(2019,10)