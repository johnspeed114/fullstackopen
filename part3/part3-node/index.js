//const http = require('http') // a built in web server module in Node.js using commonJS as standard for all these modules.
//HTTP module: called upon every request made in app and also incoming ones too. [USES]security, statistics, loggins etc
const express = require('express') //No need for http import since express module give you all the needs of that
const app = express()

app.use(express.json()) //need to add the express json-parser for the HTTP POST to work

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
]
// const app = http.createServer((request, response) => {    [**IMPORTANT!!**]No need for this createServer method as we have express to streamline this process
//   response.writeHead(200, {
//     'Content-Type': 'application/json',
//   })
//   response.end(JSON.stringify(notes))
// })

/*const app = http.createServer((request, response) => {
  // this createServer (part of the http module) create a new server
  // this creates an event handler registered to the server everytime a HTTP requests to this address
  // REQUEST: condition of response to status code 200, then it would give "Content-Type" header for the page which is 'text/plain' format
  //Finally, it ends with 'Hello World' returned
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})*/

//[NOTE] below the two gets are two routes(URLs) for the info getting showing on page
app.get('/', (request, response) => {
  //first para for http request info(location i guess), second para how the request will be responded to(so sending from server this string below)
  response.send('<h1>Hello World!</h1>') //all strings are defaulted to text/html Content-Type and status code will be 200 always
}) // Although i get 304 since the last time response is the same data so no need to change

app.get('/api/notes', (request, response) => {
  response.json(notes) //since its json format it gets the Content-type application/json
  //ALSO no need for JSON.stringify since Express changes it automatically!!! =D
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) //id param of route accessed in this request object [IMPORTANT!!] request.params.id will give you a number type, be ware when comparing to strings!!
  const note = notes.find((note) => {
    return note.id === id
  })
  if (note) {
    response.json(note)
  } else {
    response.status(404).end() //to send message an issue happening where no data is attached here
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

const generateID = () => {
  const maxID = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0 //this row for maxID with ... gives the max individual numbers since it can't have array object from map function
  return maxID + 1
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateID(),
  }
  notes = notes.concat(note)
  response.json(note)
}) //remember to use json and raw for postman testing

const PORT = 3001
app.listen(PORT)
//LINE 13 binds the http server to app, as it listens to port 3001 where we have our local server

console.log(`Server running on port ${PORT}`)
