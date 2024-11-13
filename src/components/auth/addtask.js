
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "./checkAuth";

function AddTask() {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState('Pending');
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const accessToken = useSelector(state => state.auth.accessToken); 

    useEffect(() => {
        if (!user || !accessToken) { 
            navigate("/login/");
        }
    }, [user, accessToken, navigate]);

    function addTask() {
        axios.post('http://127.0.0.1:8000/dailytasks/add_task/', {
            task_name: taskName,
            description: description,
            deadline: deadline,
            status: status
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // for authorization
            }
        })
        .then(response => {
            navigate('/tasklist'); 
        })
        .catch(error => {
            console.error('Error adding task:', error);

            if (error.response && error.response.status === 401) {
                navigate('/login'); 
            }
        });
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center text-danger mb-4">Add Task</h1>
                <div className="row justify-content-center">
                    <div className="col-sm-8 col-md-6 col-lg-4"> 
                        <div className="form-group">
                            <label className="text-white">Task Name:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter task name" 
                                value={taskName} 
                                onChange={(event) => setTaskName(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-white">Description:</label>
                            <textarea 
                                className="form-control" 
                                placeholder="Enter description" 
                                value={description} 
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-white">Deadline:</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                placeholder="Enter deadline" 
                                value={deadline} 
                                onChange={(event) => setDeadline(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-white">Status:</label>
                            <select 
                                className="form-control" 
                                value={status} 
                                onChange={(event) => setStatus(event.target.value)}
                                style={{ 
                                    color: status === 'Completed' ? 'green' : 
                                           status === 'Pending' ? 'yellow' : 
                                           'red'
                                }}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-dark btn-block" onClick={addTask}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    
export default checkAuth(AddTask)
