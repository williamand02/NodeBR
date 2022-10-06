const http = require('http')

const port = 5000;
http.createServer((request, response) => {
    response.end('Hello Node!!!')
})
    .listen(port, () => {
        console.log('O servidor esta rodando na porta', port)
    })