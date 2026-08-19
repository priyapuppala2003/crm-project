import { useState } from "react";
import Customers from "./Customers";
import Leads from "./Leads";
import Tasks from "./pages/Tasks.jsx";
import Sales from "./Sales.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Reports from "./Reports.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const [page, setPage] = useState("dashboard");

    if (!isLoggedIn) {
        return <Login />;
    }

    const username = localStorage.getItem("username");

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f8",
                padding: "40px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                    }}
                >
                    <h1 style={{ margin: 0 }}>
                        CRM Software
                    </h1>

                    <div>
                        <span style={{ marginRight: "15px" }}>
                            Welcome, {username} 👋
                        </span>

                        <button
                            onClick={logout}
                            style={{
                                padding: "9px 16px",
                                background: "#d32f2f",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "30px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <button onClick={() => setPage("dashboard")}>
                        Dashboard
                    </button>

                    <button onClick={() => setPage("customers")}>
                        Customers
                    </button>

                    <button onClick={() => setPage("leads")}>
                        Leads
                    </button>

                    <button onClick={() => setPage("tasks")}>
                        Tasks
                    </button>

                    <button onClick={() => setPage("sales")}>
                        Sales Pipeline
                    </button>

                    <button onClick={() => setPage("reports")}>
                        Reports
                    </button>
                </div>

                {page === "dashboard" && <Dashboard />}

                {page === "customers" && <Customers />}

                {page === "leads" && <Leads />}

                {page === "tasks" && <Tasks />}

                {page === "sales" && <Sales />}

                {page === "reports" && <Reports />}
            </div>
        </div>
    );
}

export default App;