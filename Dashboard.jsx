import { useEffect, useState } from "react";

const CUSTOMERS_API = "http://localhost:8080/api/customers";
const LEADS_API = "http://localhost:8080/api/leads";
const TASKS_API = "http://localhost:8080/api/tasks";
const SALES_API = "http://localhost:8080/api/sales";

function Dashboard() {
    const [customerCount, setCustomerCount] = useState(0);
    const [leadCount, setLeadCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);
    const [salesCount, setSalesCount] = useState(0);
    const [salesValue, setSalesValue] = useState(0);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const customersResponse = await fetch(CUSTOMERS_API);
            const customersData = await customersResponse.json();
            setCustomerCount(customersData.length);

            const leadsResponse = await fetch(LEADS_API);
            const leadsData = await leadsResponse.json();
            setLeadCount(leadsData.length);

            const tasksResponse = await fetch(TASKS_API);
            const tasksData = await tasksResponse.json();
            setTaskCount(tasksData.length);

            const salesResponse = await fetch(SALES_API);
            const salesData = await salesResponse.json();

            setSalesCount(salesData.length);

            const totalValue = salesData.reduce(
                (total, sale) =>
                    total + Number(sale.dealValue || 0),
                0
            );

            setSalesValue(totalValue);
        } catch (error) {
            console.error(
                "Error loading dashboard data:",
                error
            );
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f8",
                padding: "30px",
            }}
        >
            <h1
                style={{
                    marginBottom: "5px",
                    color: "#1f2937",
                }}
            >
                CRM Dashboard
            </h1>

            <p
                style={{
                    color: "#6b7280",
                    marginBottom: "30px",
                }}
            >
                Overview of your CRM activities
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "25px",
                }}
            >
                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Customers</h3>

                    <p
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            margin: "10px 0",
                        }}
                    >
                        {customerCount}
                    </p>

                    <span>Total Customers</span>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Leads</h3>

                    <p
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            margin: "10px 0",
                        }}
                    >
                        {leadCount}
                    </p>

                    <span>Total Leads</span>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Tasks</h3>

                    <p
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            margin: "10px 0",
                        }}
                    >
                        {taskCount}
                    </p>

                    <span>Total Tasks</span>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3>Sales Deals</h3>

                    <p
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            margin: "10px 0",
                        }}
                    >
                        {salesCount}
                    </p>

                    <span>Total Deals</span>
                </div>
            </div>

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)",
                }}
            >
                <h2>Sales Overview</h2>

                <p
                    style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        marginTop: "15px",
                    }}
                >
                    ₹{salesValue.toLocaleString("en-IN")}
                </p>

                <p style={{ color: "#6b7280" }}>
                    Total Deal Value
                </p>
            </div>
        </div>
    );
}

export default Dashboard;