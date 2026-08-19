import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/customers";
const USERS_API = "http://localhost:8080/api/auth/users";

function Customers() {
    const loggedInUsername = localStorage.getItem("username") || "";

    const [customers, setCustomers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        salesRep: null,
    });

    const [editingId, setEditingId] = useState(null);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(USERS_API);

            if (!response.ok) {
                throw new Error("Failed to load users");
            }

            const users = await response.json();

            const user = users.find(
                (user) => user.username === loggedInUsername
            );

            if (user) {
                setCurrentUser(user);

                setForm((previousForm) => ({
                    ...previousForm,
                    salesRep: user,
                }));
            }
        } catch (error) {
            console.error("Error loading current user:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchCurrentUser();
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
            const usersResponse = await fetch(USERS_API);

            if (!usersResponse.ok) {
                throw new Error("Failed to load current user");
            }

            const users = await usersResponse.json();

            const user = users.find(
                (user) => user.username === loggedInUsername
            );

            if (!user) {
                alert("Logged-in user not found");
                return;
            }

            const customerData = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                salesRep: {
                    id: user.id,
                },
            };

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                throw new Error("Failed to save customer");
            }

            setForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                salesRep: user,
            });

            setEditingId(null);

            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer:", error);
            alert("Failed to save customer");
        }
    };

    const handleEdit = (customer) => {
        setForm({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            company: customer.company || "",
            salesRep: customer.salesRep || currentUser,
        });

        setEditingId(customer.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete customer");
            }

            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("Failed to delete customer");
        }
    };

    return (
        <div>
            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    marginBottom: "30px",
                }}
            >
                <h2>
                    {editingId ? "Update Customer" : "Add Customer"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Customer Name"
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

                    <input
                        type="text"
                        value={
                            form.salesRep?.username ||
                            loggedInUsername
                        }
                        readOnly
                    />

                    <button type="submit">
                        {editingId
                            ? "Update Customer"
                            : "Add Customer"}
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
                                    salesRep: currentUser,
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
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
            >
                <h2>Customers</h2>

                {customers.length === 0 ? (
                    <p>No customers found.</p>
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
                            <th>Sales Rep</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.company || "-"}</td>

                                <td>
                                    {customer.salesRep
                                        ? customer.salesRep.username
                                        : "-"}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEdit(customer)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(customer.id)
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
    );
}

export default Customers;