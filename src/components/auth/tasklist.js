
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from './checkAuth';

const ListTask = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [taskToDelete, setTaskToDelete] = useState(null); 
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const accessToken = useSelector(state => state.auth.accessToken); 

    const fetchTasks = useCallback(() => {
        if (!accessToken) {
            navigate('/login');
            return; 
        }

        axios.get('http://127.0.0.1:8000/dailytasks/task_list/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`  
            }
        })
        .then(response => {
            setTasks(response.data);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        });
    }, [accessToken, navigate]);

    useEffect(() => {
        if (!user || !accessToken) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [user, accessToken, navigate, fetchTasks]);

    const handleDelete = (taskId) => {
        setTaskToDelete(taskId); // Set the task ID to delete
        setShowModal(true); // Show the modal
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            axios.delete(`http://127.0.0.1:8000/dailytasks/delete_task/${taskToDelete}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(() => {
                fetchTasks(); // Refresh the task list after deletion
                setShowModal(false); // Close the modal
                setTaskToDelete(null); // Clear the task ID
            })
            .catch(error => {
                console.error('Error deleting task:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');  
                }
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center text-danger mb-4">Task List</h1>
                <Link to="/addtask">
                    <button className="btn btn-primary mb-3">Add Task</button>
                </Link>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>{task.task_name}</td>
                                        <td>{task.description}</td>
                                        <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                        <td 
                                            style={{ 
                                                color: task.status === 'Completed' ? 'green' :
                                                       task.status === 'Pending' ? 'yellow' : 
                                                       'red'
                                            }}
                                        >
                                            {task.status}
                                        </td>
                                        <td>
                                            <Link to={`/updatetask/${task.id}`}>
                                                <button className="btn btn-warning me-2">Edit</button>
                                            </Link>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No tasks available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bootstrap Modal for Confirm Delete */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Confirm Deletion</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this task?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(ListTask);
