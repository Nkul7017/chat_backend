const http=require('http');
const express=require('express');
const cors=require('cors');
const { Server } = require('socket.io'); 
let users={};
const app=express();
const port=3001||process.env.PORT

app.use(cors());

app.get('/',(req,res)=>{
res.send("Chat server is working")
})

const server=http.createServer(app);
// console.log(server);


const io = new Server(server, {
    cors: {
      origin: 'https://chat-web-app-seven.vercel.app',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("joined",({name})=>
    {
      users[socket.id]=name;
      console.log(users);
   console.log(name+" has"+" joined");
   
   socket.broadcast.emit("userJoined",{user:"Admin",message:`${users[socket.id]} joined the chat`})
})

    socket.emit("Welcome",{user:"Admin",message:"Welcome to the Chat"})

    socket.on("disconnect",()=>{
      socket.broadcast.emit('Leave',{user:"Admin",message:`${users[socket.id] } left the chat`});
       console.log("user left")
     
    })

    socket.on("Message",(data)=>{
    io.emit('sendMessage',{user:users[socket.id],message:data.message,id:socket.id})
    })
  });



server.listen(port,()=>{
    console.log(`server is working on  ${port}`)
})