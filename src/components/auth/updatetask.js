
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from './checkAuth';

function UpdateTask() {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState('Pending');
    const navigate = useNavigate();
    const { id } = useParams(); // Getting the task ID from the URL
    const user = useSelector(state => state.auth.user);
    const accessToken = useSelector(state => state.auth.accessToken); 
    console.log('Access Token:', accessToken); 


    const fetchTaskDetails = useCallback(() => {
        axios.get(`http://127.0.0.1:8000/dailytasks/each_id_task_list/${id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` 
            }
        })
        .then(response => {
            const { task_name, description, deadline, status } = response.data;
            setTaskName(task_name);
            setDescription(description);
            setDeadline(deadline);
            setStatus(status);
        })
        .catch(error => {
            console.error('Error fetching task details:', error);
            
            if (error.response && error.response.status === 401) {
                navigate('/login');  // Redirect to login if unauthorized
            }
        });
    }, [accessToken, id, navigate]);

    useEffect(() => {
        if (!user || !accessToken) {
            console.warn('User is not authenticated or access token is missing');
            navigate('/login');
        } else {
            fetchTaskDetails();
        }
    }, [user, accessToken, navigate, fetchTaskDetails]);
    

    function updateTask() {
        axios.put(`http://127.0.0.1:8000/dailytasks/edit_task/${id}/`, {
            task_name: taskName,
            description: description,
            deadline: deadline,
            status: status
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`  
            }
        })
        .then(response => {
            navigate('/tasklist/');
        })
        .catch(error => {
            console.error('Error updating task:', error);
           
            if (error.response && error.response.status === 401) {
                navigate('/login'); 
            }
        });
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center text-danger mb-4">Update Task</h1>
                <div className="container mt-4">
    <div className="card bg-dark text-white">
        {/* <div className="card-header text-center">
            <h2>Update Task</h2>
        </div> */}
        <div className="card-body">
            <div className="mb-3">
                <label className="form-label">Task Name:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={taskName} 
                    onChange={(event) => setTaskName(event.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea 
                    className="form-control" 
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Deadline:</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={deadline} 
                    onChange={(event) => setDeadline(event.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Status:</label>
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
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div className="text-center">
                <button className="btn btn-primary" onClick={updateTask}>Update</button>
            </div>
        </div>
    </div>
</div>

            </div>
        </div>
    );
}

export default checkAuth(UpdateTask);
