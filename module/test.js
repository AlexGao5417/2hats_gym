// const axios = require('axios')
// const axiosConfig = {
//   baseURL: 'https://buoyant-yew-252813.appspot.com',
//   timeout: 30000,
//   };

// const app = axios.create(axiosConfig);
const app = require('axios')

postTest = (year, month, day, hour, minute) => app.post(`http://localhost:8080/book?year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}`)
  .then(
    (res) => {
      console.log(res.data)
    })
  .catch((error) => {
    console.error(error)
  })

dailyTest = (year, month=2, day=3) => app.get(`http://localhost:8080/timeslots?year=${year}&month=${month}&day=${day}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

monthlyTest = (year, month) => app.get(`http://localhost:8080/days?year=${year}&month=${month}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

dailyTest(2019,9,16)
// postTest(2019, 9, 16, 9,45)
// postTest(2019, 9, 16, 10,30)
// postTest(2019, 9, 16, 11,15)
// postTest(2019, 9, 16, 12,00)
// postTest(2019, 9, 16, 12,45)
// postTest(2019, 9, 16, 13,30)
// postTest(2019, 9, 16, 14,15)
// postTest(2019, 9, 16, 15,0)
// postTest(2019, 9, 16, 15,45)
// postTest(2019, 9, 16, 16,30)
// postTest(2019, 9, 16, 17,15)

monthlyTest(2019,9)
