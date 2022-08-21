import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import AddTask from "./components/AddTask"
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import About from './components/About'

const App = () => {
  const [ showAddTask, setShowAddTask ] = useState(false)
  const [ tasks, setTasks ] = useState([])
  const [ taskPending, setTaskPending ] = useState(true)

    //Fetch tasks
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:5000/tasks")
      const data = await response.json()
  
      return data
    }

    //Fetch task
    const fetchTask = async (id) => {
      const response = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await response.json()
  
      return data
    }

  useEffect(() => {
    setTimeout(() => {
      const getTask = async () => {
        const taskFromServer = await fetchTasks()
        setTaskPending(false)
        setTasks(taskFromServer)
      }
  
      getTask()
    }, 1000);
  }, [])




   //Add Task
   const addTask = async(task) => {

    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()
    console.log(data);
    setTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 10000) + 1 
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
   }

  //deleteTask

  const deleteTask = async(id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    })

    setTasks(tasks.filter(task => task.id !== id))
  }

  //Toggle Reminder

  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
 
    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updTask)
    })

    const data = await response.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder : data.reminder } : task ))
  }

  return (
    <Router>
    <div className='App container'>
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAddTask={ showAddTask } />
      <Routes>
        <Route path="/" element={
          <>
          { taskPending && <div className="taskPend">Please wait...</div> }
          { showAddTask && <AddTask onAdd={addTask} /> }
          { tasks.length > 0 ? (<Tasks tasks={ tasks } onDelete={ deleteTask } onToggle={ toggleReminder } />) : ( "No Tasks To Show" ) }
          </>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
    </Router>
  )
}

export default App