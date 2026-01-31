import app from "./app.js"
import dotenv from "dotenv"
import { createServer } from "http";
import { Server } from "socket.io";
import generateresponse from "./services/ai.services.js"
import { response } from "express";
dotenv.config({
    path: './.env'
});

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {    //Io means whole server but socket means only one user
  console.log("A user connected")
  socket.on("disconnected",()=>{
    console.log("A User disconnected")
  })

  const chathistory=[
    
  ]
  socket.on("ai-message", async (data)=>{
    chathistory.push({
      role:"user",
      parts:[{text:data}]
    })
    const response=await generateresponse(chathistory)

    chathistory.push({
      role:"model",
      parts:[{text:data}]
    })
    console.log("AI Response",response)
    socket.emit("ai-message-response",{response})
  })
});

httpServer.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running at port:${process.env.PORT}`)
}) 