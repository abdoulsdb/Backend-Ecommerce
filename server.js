const http = require('http');
const app = require('./app');
const server = http.createServer(app);
 //Notre serveur est creer donc

server.listen(3000 ,() =>{
   console.log('Server is running at localhost : 3000');
});