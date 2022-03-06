const httpServer = require('./app.js')
const {PORT} = require('./config.js')


/*servidor */


const server = httpServer.listen(PORT.p, () => {
    console.log(`SERVER ON corriento en el puerto: ${PORT.p}`);
});

server.on('error', error => { console.log(error)})

