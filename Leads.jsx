import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/leads";

function Leads() {
    const loggedInUsername = localStorage.getItem("username") || "";

    const [leads, setLeads] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "",
        salesRep: null,
    });

    const [editingId, setEditingId] = useState(null);

    const fetchLeads = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.error("Error fetching leads:", error);
        }
    };

    const fetchLoggedInUser = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/users"
            );

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            const users = await response.json();

            const currentUser = users.find(
                (user) => user.username === loggedInUsername
            );

            if (currentUser) {
                setForm((previousForm) => ({
                    ...previousForm,
                    salesRep: currentUser,
                }));
            }
        } catch (error) {
            console.error("Error loading logged-in user:", error);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchLoggedInUser();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to save lead");
            }

            setForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                status: "",
                salesRep: form.salesRep,
            });

            setEditingId(null);
            fetchLeads();
        } catch (error) {
            console.error("Error saving lead:", error);
            alert("Failed to save lead");
        }
    };

    const handleEdit = (lead) => {
        setForm({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company || "",
            status: lead.status || "",
            salesRep: lead.salesRep || null,
        });

        setEditingId(lead.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete lead");
            }

            fetchLeads();
        } catch (error) {
            console.error("Error deleting lead:", error);
            alert("Failed to delete lead");
        }
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
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <h1
                    style={{
                        textAlign: "center",
                        color: "#1f2937",
                        marginBottom: "30px",
                    }}
                >
                    CRM Lead Management
                </h1>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        marginBottom: "30px",
                    }}
                >
                    <h2>{editingId ? "Update Lead" : "Add Lead"}</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Lead Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                        </select>

                        <input
                            type="text"
                            value={form.salesRep?.username || loggedInUsername}
                            readOnly
                        />

                        <button type="submit">
                            {editingId ? "Update Lead" : "Add Lead"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);

                                    setForm({
                                        name: "",
                                        email: "",
                                        phone: "",
                                        company: "",
                                        status: "",
                                        salesRep: form.salesRep,
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
                    <h2>Leads</h2>

                    {leads.length === 0 ? (
                        <p>No leads found.</p>
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Sales Rep</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>{lead.id}</td>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td>{lead.company || "-"}</td>
                                    <td>{lead.status}</td>

                                    <td>
                                        {lead.salesRep
                                            ? lead.salesRep.username
                                            : "-"}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEdit(lead)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(lead.id)
                                            }
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
        </div>
    );
}

export default Leads;