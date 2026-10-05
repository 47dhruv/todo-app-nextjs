"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {toast} from "react-hot-toast"

interface Todo {
  id:number;
  title:string;
  description?:string;
  completed:boolean;
}

const Homepage = () => {
const [todos, setTodos] = useState<Todo[]>([])
const [title, settitle] = useState <string>("")


const todolist=async()=>{
try {
  const response= await axios.get(`http://localhost:3000/api/todos`)
  console.log(response)

  toast.success("todo list fetched successfully")
  setTodos(response.data.todo)
} catch (error) {
console.log(error)
toast.error("something went wrong")
}
}

const delteHandler =async(id:number)=>{
 try {
  const response= await axios.delete(`http://localhost:3000/api/todos/${id}`)
  console.log(response)
  toast.success("todo deleted successfully")
  setTodos(prev=>prev.filter((todo:Todo)=>todo.id !==id))
} catch (error) {
console.log(error)
toast.error("todo not deleted")
} 
}

const toogle=async(id:number,completed:boolean)=>{
try {
    const response= await axios.patch(`http://localhost:3000/api/todos/${id}`,{completed:!completed})
  
  

  toast.success("todo updated successfully")
  setTodos((prev)=>prev.map((todo)=>todo.id===id?{...todo,completed:!completed}:todo))
} catch (error) {
  toast.error("something went wrong")
}
}

const onSubmitHandler=async(e:any)=>{
e.preventDefault()

if (title.trim().length<=0) {
  toast.error("title is required")
  return
}
try{
const response = await axios.post(`http://localhost:3000/api/todos`, { title })
setTodos((prev)=>[...prev,response.data.data])
toast.success("todo added successfully")
settitle("")


}catch(error){
console.log(error)
toast.error("something went wrong")
}}


useEffect(() => {
 todolist()
}, [])


  return (<>
    <div>{todos.map((e:Todo)=>(
      
      <div key={e.id}>
        <div>
          <h1>{e.title}</h1>
          <p>{e.description}</p>
          <p>{e.completed.toString()}</p>
        </div>
        <button onClick={()=>toogle(e.id,e.completed)}>update</button>
        <button onClick={()=>delteHandler(e.id)}>delete</button>
               
      </div>


    ))}</div>
    <form onSubmit={onSubmitHandler}><input type="text" value={title} onChange={(e) =>settitle(e.target.value)} />
      <button type='submit'>add todo</button></form>
    
</>
  )
}

export default Homepage