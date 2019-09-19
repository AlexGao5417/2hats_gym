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
// postTest(2019, 9, 23, 1)
// postTest(2019, 9, 23, 9,45)
// postTest(2019, 9, 23, 10,30)
// postTest(2019, 9, 23, 11,15)
// postTest(2019, 9, 23, 12,00)
// postTest(2019, 9, 23, 12,45)
// postTest(2019, 9, 23, 13,30)
// postTest(2019, 9, 23, 14,15)
// postTest(2019, 9, 23, 15,0)
// postTest(2019, 9, 23, 15,45)
// postTest(2019, 9, 23, 16,30)
// postTest(2019, 9, 23, 17,15)

// postTest(2019, 9, 17, 15,45)

// monthlyTest(2019)

// console.log({a:"d"});
// console.log({"a":"d"});

