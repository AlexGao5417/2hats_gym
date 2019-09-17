exports.errorDateHandler = (date, type) => {

  if (date.month === undefined || date.month === 'undefined') {
    console.log("month problem");
    return({
      "success": false,
      "message": "Request is missing parameter: month"
    })
  }
  if (date.year === undefined || date.year === 'undefined') {
    return({
      "success": false,
      "message": 'Request is missing parameter: year'
    })
  }
  if (type === 'monthlyCheck') return "valid"
  if (date.day === undefined || date.day === 'undefined') {
    return({
      "success": false,
      "message": "Request is missing parameter: day"
    })
  }
  if (type === 'dailyCheck') return "valid"
  if (date.minute === undefined || date.minute === 'undefined') {
    return({
      "success": false,
      "message": "Request is missing parameter: minute"
    })
  }
  return "valid"
}