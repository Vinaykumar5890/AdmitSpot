const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')
const moment = require('moment-timezone')
const databasePath = path.join(__dirname, 'userData.db')

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at https://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        next()
      }
    })
  }
}

app.get('/users', authenticateToken, async (request, response) => {
  try {
    const getStateQuery = `
    SELECT 
      *
    FROM 
      user`
    const db = await database.all(getStateQuery)
    response.send(db)
  } catch (err) {
    response.send(err)
    console.log(err)
  }
})
app.get('/users/:username', authenticateToken, async (request, response) => {
  const {username} = request.params
  try {
    const getStateQuery = `
    SELECT 
      *
    FROM 
      user WHERE username ='${username}'`
    const db = await database.all(getStateQuery)
    response.send(db)
  } catch (err) {
    response.send(err)
    console.log(err)
  }
})

const validatePassword = password => {
  return password.length > 4
}

app.post('/register', async (request, response) => {
  const {username, email, password} = request.body
  const hashedPassword = await bcrypt.hash(request.body.password, 10)
  try {
    const selectUserQuery = `SELECT * FROM user WHERE email = '${email}'`
    const dbUser = await database.get(selectUserQuery)
    if (dbUser === undefined) {
      const createUserQuery = `
      INSERT INTO 
        user (username, email, password) 
      VALUES 
        (
          '${username}', 
          '${email}',
          '${hashedPassword}'
        )`
      if (validatePassword(password)) {
        const dbResponse = await database.run(createUserQuery)
        const newUserId = dbResponse.lastID
        response.send(`User created successfully with ${newUserId}`)
      } else {
        response.status(400)
        response.send('Password is too short')
      }
    } else {
      response.status(400)
      response.send('User already exists')
    }
  } catch (err) {
    response.send(err)
  }
})
app.post('/login/', async (request, response) => {
  const {email, password} = request.body
  try {
    const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`
    const databaseUser = await database.get(selectUserQuery)
    if (databaseUser === undefined) {
      response.status(400)
      response.send('Invalid user')
    } else {
      const isPasswordMatched = await bcrypt.compare(
        password,
        databaseUser.password,
      )
      if (isPasswordMatched === true) {
        const payload = {
          email: email,
        }
        const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
        response.send({jwtToken})
      } else {
        response.status(400)
        response.send('Invalid password')
      }
    }
  } catch (err) {
    response.send(err)
  }
})

app.put('/change-password', async (request, response) => {
  const {email, oldPassword, newPassword} = request.body
  try {
    const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`
    const databaseUser = await database.get(selectUserQuery)
    if (databaseUser === undefined) {
      response.status(400)
      response.send('Invalid user')
    } else {
      const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        databaseUser.password,
      )
      if (isPasswordMatched === true) {
        if (validatePassword(newPassword)) {
          const hashedPassword = await bcrypt.hash(newPassword, 10)
          const updatePasswordQuery = `
          UPDATE
            user
          SET
            password = '${hashedPassword}'
          WHERE
            email= '${email}';`

          const user = await database.run(updatePasswordQuery)
          response.send('Password updated')
        } else {
          response.status(400)
          response.send('Password is too short')
        }
      } else {
        response.status(400)
        response.send('Invalid current password')
      }
    }
  } catch (err) {
    response.send(err)
  }
})

app.post('/contact', authenticateToken, async (request, response) => {
  const {name, email, phone, address} = request.body
  const createdAt = moment().utc().format('YYYY-MM-DD HH:mm:ss')
  const updatedAt = createdAt
  const m = uuidv4()
  const localTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  try {
    const selectUserQuery = `SELECT * FROM contact WHERE phone = '${phone}'`
    const dbUser = await database.get(selectUserQuery)
    if (dbUser === undefined) {
      const createUserQuery = `
      INSERT INTO 
       contact (id,name, email,phone,address,timezone) 
      VALUES 
        ('${m}','${name}','${email}','${phone}','${address}','${localTime}'
        )`

      const dbResponse = await database.run(createUserQuery)
      response.send(`Contact  created successfully with ${m}`)
    } else {
      response.status(400)
      response.send('contact already exists')
    }
  } catch (err) {
    response.send(err)
  }
})
app.get('/contact', authenticateToken, async (request, response) => {
  try {
    const selectUserQuery = `SELECT * FROM contact;`
    const dbResponse = await database.all(selectUserQuery)
    response.send(dbResponse)
  } catch (err) {
    response.send(err)
  }
})
app.get('/contact/:id', authenticateToken, async (request, response) => {
  const {id} = request.params
  try {
    const getStateQuery = `
    SELECT 
      *
    FROM 
      contact
    WHERE 
      id = '${id}';`
    const state = await database.get(getStateQuery)
    response.send(state)
  } catch (err) {
    response.send(err)
  }
})
app.delete('/contact/:id', authenticateToken, async (request, response) => {
  const {id} = request.params
  try {
    const getStateQuery = `
    DELETE FROM contact
    WHERE 
      id = '${id}';`
    const state = await database.run(getStateQuery)
    response.send('Contact Deleted Successfully')
  } catch (err) {
    response.send(err)
  }
})

app.put('/contact/:id', authenticateToken, async (request, respose) => {
  const {id} = request.params
  const {name, email, phone, address} = request.body
  const localTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
  try {
    const updatedContact = `UPDATE contact SET name ='${name}',email ='${email}',phone ='${phone}',address = '${address}',timezone = '${localTime}'
  WHERE 
   id = '${id}';`
    const dbResponse = await database.run(updatedContact)
    respose.send('Contact Updated Succesfully')
  } catch (err) {
    respose.send(err)
    console.log(err)
  }
})
module.exports = app
