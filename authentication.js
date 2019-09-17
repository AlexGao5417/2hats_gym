const fs = require('fs')
const { google } = require('googleapis')
const TOKEN_PATH = 'token.json'



getToken = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('credentials.json', async (err, content) => {
      if (err) reject('Error loading client secret file:', err)
      // Authorize a client with credentials, then call the Google Calendar API.
      const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      )
      resolve(oAuth2Client)
    })
  })
}
setAuth = (oAuth2Client) => {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) reject(oAuth2Client, () => { console.log(err) })
      oAuth2Client.setCredentials(JSON.parse(token))
      resolve(oAuth2Client)
    })
  })
}

exports.getAuth = async () => {
  const oAuth2Client = await getToken()
  const auth = await setAuth(oAuth2Client)
  return auth
}


//      result = await action(oAuth2Client, date)
//      resolve(result)