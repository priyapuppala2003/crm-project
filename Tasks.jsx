import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/tasks";
const USERS_API = "http://localhost:8080/api/auth/users";

function Tasks() {
    const loggedInUsername = localStorage.getItem("username") || "";

    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        loadTasks();
        loadCurrentUser();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const loadCurrentUser = async () => {
        try {
            const response = await fetch(USERS_API);

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            const users = await response.json();

            const user = users.find(
                (user) =>
                    user.username.trim().toLowerCase() ===
                    loggedInUsername.trim().toLowerCase()
            );

            if (user) {
                setCurrentUser(user);
            }
        } catch (error) {
            console.error("Error loading current user:", error);
        }
    };

    const addTask = async (event) => {
        event.preventDefault();

        if (title.trim() === "" || dueDate === "") {
            alert("Please enter task title and due date");
            return;
        }

        if (!currentUser) {
            alert("Logged-in user not found");
            return;
        }

        const newTask = {
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            status: "Pending",
            assignedTo: {
                id: currentUser.id
            }
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                throw new Error("Failed to add task");
            }

            await response.json();

            setTitle("");
            setDescription("");
            setPriority("Medium");
            setDueDate("");

            await loadTasks();

            alert("Task added successfully");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task");
        }
    };

    const changeStatus = async (task) => {
        const updatedTask = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            status:
                task.status === "Pending"
                    ? "Completed"
                    : "Pending",
            assignedTo: task.assignedTo
                ? {
                    id: task.assignedTo.id
                }
                : null
        };

        try {
            const response = await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            await loadTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task");
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks((oldTasks) =>
                oldTasks.filter((task) => task.id !== id)
            );

            alert("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <h2
                style={{
                    color: "#222",
                    marginBottom: "25px"
                }}
            >
                Task Management
            </h2>

            <form
                onSubmit={addTask}
                style={{
                    background: "#f8f9fa",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                    border: "1px solid #ddd"
                }}
            >
                <h3>Add New Task</h3>

                <div style={{ marginBottom: "15px" }}>
                    <label>Task Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Enter task title"
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Enter task description"
                        rows="4"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Priority</label>

                    <select
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px"
                        }}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>Due Date</label>

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(event) =>
                            setDueDate(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>Assigned To</label>

                    <input
                        type="text"
                        value={currentUser?.username || loggedInUsername}
                        readOnly
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                            background: "#eee"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: "11px 25px",
                        background: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Add Task
                </button>
            </form>

            <h3>Tasks List</h3>

            {tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <div>
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            style={{
                                background: "white",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "20px",
                                marginBottom: "15px"
                            }}
                        >
                            <h3>{task.title}</h3>

                            <p>
                                <strong>Description:</strong>{" "}
                                {task.description || "No description"}
                            </p>

                            <p>
                                <strong>Priority:</strong>{" "}
                                {task.priority}
                            </p>

                            <p>
                                <strong>Due Date:</strong>{" "}
                                {task.dueDate}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {task.status}
                            </p>

                            <p>
                                <strong>Assigned To:</strong>{" "}
                                {task.assignedTo
                                    ? task.assignedTo.username
                                    : "-"}
                            </p>

                            <button
                                onClick={() => changeStatus(task)}
                                style={{
                                    padding: "9px 15px",
                                    marginRight: "10px",
                                    background: "#4caf50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                {task.status === "Pending"
                                    ? "Mark Completed"
                                    : "Mark Pending"}
                            </button>

                            <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                    padding: "9px 15px",
                                    background: "#d32f2f",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Tasks;