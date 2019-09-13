const axios = require('axios')
const axiosConfig = {
  baseURL: 'https://buoyant-yew-252813.appspot.com',
  timeout: 30000,
  };

const app = axios.create(axiosConfig);


postTest = (year, month, day, hour, minute) => app.post(`/book?year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}`)
  .then(
    (res) => {
      console.log(res.data)
    })
  .catch((error) => {
    console.error(error)
  })

dailyTest = (year, month=2, day=3) => app.get(`/timeslots?year=${year}&month=${month}&day=${day}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

monthlyTest = (year, month) => app.get(`/days?year=${year}&month=${month}`)
  .then((res) => {
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })

// dailyTest()
postTest(2019, 10, 2, 10,55)
monthlyTest(2019,10)
