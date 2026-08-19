import { useEffect, useState } from "react";

const SALES_API = "http://localhost:8080/api/sales";
const LEADS_API = "http://localhost:8080/api/leads";
const TASKS_API = "http://localhost:8080/api/tasks";

function Reports() {
    const [sales, setSales] = useState([]);
    const [leads, setLeads] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const salesResponse = await fetch(SALES_API);
            const salesData = await salesResponse.json();
            setSales(salesData);

            const leadsResponse = await fetch(LEADS_API);
            const leadsData = await leadsResponse.json();
            setLeads(leadsData);

            const tasksResponse = await fetch(TASKS_API);
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
        } catch (error) {
            console.error("Error loading reports:", error);
        }
    };

    const totalSalesValue = sales.reduce(
        (total, sale) =>
            total + Number(sale.dealValue || 0),
        0
    );

    const closedWon = sales.filter(
        (sale) => sale.stage === "Closed Won"
    ).length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "Pending"
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const qualifiedLeads = leads.filter(
        (lead) => lead.status === "Qualified"
    ).length;

    return (
        <div
            style={{
                background: "#f4f6f8",
                padding: "25px",
                minHeight: "100vh",
            }}
        >
            <h2>CRM Reports</h2>

            <p style={{ color: "#666" }}>
                Sales, Leads and Task performance overview
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "25px",
                }}
            >
                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Total Sales Value</h3>

                    <h2>
                        ₹{totalSalesValue.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Closed Won Deals</h3>

                    <h2>{closedWon}</h2>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Qualified Leads</h3>

                    <h2>{qualifiedLeads}</h2>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Task Report</h3>

                    <p>
                        Pending Tasks: <strong>{pendingTasks}</strong>
                    </p>

                    <p>
                        Completed Tasks:{" "}
                        <strong>{completedTasks}</strong>
                    </p>

                    <p>
                        Total Tasks:{" "}
                        <strong>{tasks.length}</strong>
                    </p>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Lead Report</h3>

                    <p>
                        Total Leads:{" "}
                        <strong>{leads.length}</strong>
                    </p>

                    <p>
                        Qualified Leads:{" "}
                        <strong>{qualifiedLeads}</strong>
                    </p>

                    <p>
                        New Leads:{" "}
                        <strong>
                            {
                                leads.filter(
                                    (lead) =>
                                        lead.status === "New"
                                ).length
                            }
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Reports;