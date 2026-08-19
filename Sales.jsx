import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/sales";

function Sales() {
    const loggedInUser = localStorage.getItem("username") || "";

    const [sales, setSales] = useState([]);

    const [form, setForm] = useState({
        dealName: "",
        customerName: "",
        salesRep: loggedInUser,
        stage: "New",
        dealValue: "",
        closeDate: "",
    });

    const [editingId, setEditingId] = useState(null);

    const fetchSales = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setSales(data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    dealValue: Number(form.dealValue),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save sale");
            }

            setForm({
                dealName: "",
                customerName: "",
                salesRep: loggedInUser,
                stage: "New",
                dealValue: "",
                closeDate: "",
            });

            setEditingId(null);

            fetchSales();
        } catch (error) {
            console.error("Error saving sale:", error);
            alert("Failed to save sale");
        }
    };

    const handleEdit = (sale) => {
        setForm({
            dealName: sale.dealName,
            customerName: sale.customerName,
            salesRep: sale.salesRep || loggedInUser,
            stage: sale.stage,
            dealValue: sale.dealValue,
            closeDate: sale.closeDate,
        });

        setEditingId(sale.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this deal?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete sale");
            }

            fetchSales();
        } catch (error) {
            console.error("Error deleting sale:", error);
            alert("Failed to delete sale");
        }
    };

    return (
        <div>
            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                }}
            >
                <h2>
                    {editingId ? "Update Deal" : "Add Sales Deal"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="dealName"
                        placeholder="Deal Name"
                        value={form.dealName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="salesRep"
                        value={form.salesRep}
                        readOnly
                    />

                    <select
                        name="stage"
                        value={form.stage}
                        onChange={handleChange}
                    >
                        <option value="New">New</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                    </select>

                    <input
                        type="number"
                        name="dealValue"
                        placeholder="Deal Value"
                        value={form.dealValue}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="date"
                        name="closeDate"
                        value={form.closeDate}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        {editingId ? "Update Deal" : "Add Deal"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);

                                setForm({
                                    dealName: "",
                                    customerName: "",
                                    salesRep: loggedInUser,
                                    stage: "New",
                                    dealValue: "",
                                    closeDate: "",
                                });
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px",
                }}
            >
                <h2>Sales Pipeline</h2>

                {sales.length === 0 ? (
                    <p>No sales deals found.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Deal Name</th>
                            <th>Customer</th>
                            <th>Sales Rep</th>
                            <th>Stage</th>
                            <th>Deal Value</th>
                            <th>Close Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>{sale.dealName}</td>
                                <td>{sale.customerName}</td>
                                <td>{sale.salesRep}</td>
                                <td>{sale.stage}</td>
                                <td>₹{sale.dealValue}</td>
                                <td>{sale.closeDate}</td>

                                <td>
                                    <button
                                        onClick={() => handleEdit(sale)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(sale.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Sales;