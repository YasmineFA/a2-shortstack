const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require('mime'),
  dir = 'public/',
  port = 3000

const appdata = []

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response)
  } else if (request.method === 'POST') {
    handlePost(request, response)
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === '/') {
    sendFile(response, 'public/index.html')
  } else {
    sendFile(response, filename)
  }
}

const handlePost = function (request, response) {
  let dataString = ''

  request.on('data', function (data) {
    dataString += data
  })

  // if ($_POST['action'] == 'delete') {
  //   request.on('end', function () {
  //     let newDelete = JSON.parse(dataString)
  //     let rowID = newDelete.delete
  //     appdata.splice(rowID, 1)


  //     response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  //     response.write(JSON.stringify(appdata))
  //     console.log(appdata)
  //     response.end()
  //   })
  // }
  // else {
  if (request.url === '/submit') {
    request.on('end', function () {
      console.log(JSON.parse(dataString).DOB)
      let newEntry = JSON.parse(dataString)
      const date = new Date();
      let birthYr = newEntry.DOB.slice(0, 4);
      newEntry.age = date.getFullYear() - birthYr;

      // ... do something with the data here!!!

      console.log(newEntry)
      appdata.push(newEntry)


      response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      response.write(JSON.stringify(appdata))
      console.log(appdata)
      response.end()
    })
  }
  else if(request.url === '/remove'){
    request.on('end', function () {
          let newDelete = JSON.parse(dataString)
          let rowID = newDelete.delete
          appdata.splice(rowID, 1)
    
    
          response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
          response.write(JSON.stringify(appdata))
          console.log(appdata)
          response.end()
        })
  }
  // }
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we've loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end('404 Error: File Not Found')

    }
  })
}

server.listen(process.env.PORT || port)