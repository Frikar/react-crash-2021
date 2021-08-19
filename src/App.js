import Header from "./components/Header";
import Tasks from "./components/Tasks";
import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import AddTask from "./components/AddTask"
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "DELETE",
        })
        setTasks(tasks.filter((task) => task.id !== id))
    }
    const toggleReminder = async (id) => {
        const taskToggle = await fetchTask(id)
        const updTask = {...taskToggle, reminder: !taskToggle.reminder}
        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(updTask)
        })
        const data = await res.json()
        setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
    }
    const addTask = async (task) => {
        const res = await fetch('http://localhost:5000/tasks', {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        const data = await res.json()

        setTasks([...tasks, data])
    }
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
        }
        getTasks().then(r => r)
    }, [])
    const fetchTasks = async () => {
        const results = await fetch('http://localhost:5000/tasks')
        return await results.json()
    }
    const fetchTask = async (id) => {
        const results = await fetch(`http://localhost:5000/tasks/${id}`)
        return await results.json()
    }
    return (
        <Router>
            <div className="container">
                <Header title='Tasks Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
                <Route path='/' exact render={(props) => (
                    <>
                        {showAddTask && <AddTask onAddTask={addTask}/>}
                        {tasks.length > 0 ? (
                            <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
                        ) : (
                            'No Tasks To Show'
                        )}
                    </>
                )}/>
                <Route path="/about" component={About}/>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
