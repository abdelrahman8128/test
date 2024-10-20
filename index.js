const http =require('http');
const server=http.createServer();
const {Server}=require('socket.io');
const io=new Server(server);


const port=3700;

io.on('connection',(socket)=>{

  socket.on(
    "postion-change",(data)=>{
      io.emit("positon-change",data);

    });
    socket.on("disconnect",(data)=>{});
     
  
});

server.listen(port,()=>{
  console.log(`listening on ${port}`);
});