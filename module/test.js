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

dailyTest = (year, month = 2, day) => app.get(`http://localhost:8080/timeslots?year=${year}&month=${month}&day=${day}`)
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

  // dailyTest(2019, 10)
// postTest(2019, 10, 9, 9,45)http://localhost:8080/timeslots?year=2019&month=10&day=25
// postTest(2019, 10, 9, 10,30)
// postTest(2019, 10, 9, 11,15)
// postTest(2019, 10, 9, 12,00)
// postTest(2019, 10, 9, 12,45)
// postTest(2019, 10, 9, 13,30)
// postTest(2019, 10, 9, 14,15)
// postTest(2019, 10, 9, 15,0)
// postTest(2019, 10, 9, 15,45)
// postTest(2019, 10, 9, 16,30)
// postTest(2019, 10, 9, 17,15)

// postTest(2019, 9, 17, 15,45)

monthlyTest(2019)

// console.log({a:"d"});
// console.log({"a":"d"});

