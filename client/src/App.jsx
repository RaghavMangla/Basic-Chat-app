import React, { useEffect, useMemo, useState } from 'react'
import io from "socket.io-client";
import {Container,TextField,Typography,Button,Box,Stack} from "@mui/material"
const App = () => {
  // const socket=io("http://localhost:3000");
  //sirf upar wale se jaise hi message ki value change hoti baar baar rerender hota component
  //toh isko avoid karne ke lie useMemo hook ka use karenge
  const socket=useMemo(()=>io("http://localhost:3000",{
    withCredentials:true,
  }),[]);
  const [message,setmessage]=useState("");
  const [room,setroom]=useState("");
  const [socketid,setsocketid]=useState("");
  const [messages,setmessages]=useState([]);
  const [roomName,setroomName]=useState("");

  console.log(messages);
  const handleSubmit=(e)=>{
    e.preventDefault();//taki refresh na ho page
    socket.emit("message",{message,room});
    setmessage("");
    setroom("");
  }

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName);
    setroomName("");
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id);
      setsocketid(socket.id);
    });

    socket.on("receive-message",(data)=>{
      console.log(data);
      setmessages((messages)=>[...messages,data]);
    });

    socket.on("welcome",(s)=>{
      console.log(s);
    });

    return ()=>{
      socket.disconnect();
    };
  }
  ,[]);

   return <Container maxWidth="sm">
    <Box sx={{height:500}}/>
    
   
    <form onSubmit={joinRoomHandler}>
      <Stack margin={2}>
      <h2>Join Room</h2>
      <Stack width={400} spacing={2}  direction="row">
      <TextField value={roomName} fullWidth onChange={((e)=>{setroomName(e.target.value)})} id="outlined-basic" label="Room Name" variant="outlined"/>
      <Button type="submit" variant="contained" color="primary" margin="normal">Join</Button>
      </Stack>
      </Stack>
    </form>
      <form onSubmit={handleSubmit} >
        <Stack width={400} spacing={2} margin={2}>
        <TextField value={message} fullWidth onChange={((e)=>{setmessage(e.target.value)})} id="outlined-basic" label="Message" variant="outlined"/>
        <TextField value={room} fullWidth onChange={((e)=>{setroom(e.target.value)})} id="outlined-basic" label="Room" variant="outlined"/>
        <Button type="submit" fullWidth variant="contained" color="primary">Send</Button>
        </Stack>
      </form>

      <Stack>
          {messages.map((m,i)=>(
            <Typography key={i} variant='h6' component="div" gutterBottom>{m}</Typography>
          ))}
      </Stack>
  
   </Container>
}

export default App
