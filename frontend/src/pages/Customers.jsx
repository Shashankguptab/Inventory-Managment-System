import { useEffect, useState } from "react";
import api from "../api/axios";

function Customers() {
  // -----------------------------
  // STATE
  // -----------------------------

  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // -----------------------------
  // READ CUSTOMERS
  // -----------------------------

  const fetchCustomers = async () => {
    try {
      const response = await api.get("customers/");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load customers.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // -----------------------------
  // HANDLE INPUT
  // -----------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // CREATE / UPDATE
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // UPDATE
        await api.put(
          `customers/${editingId}/`,
          formData
        );
      } else {
        // CREATE
        await api.post(
          "customers/",
          formData
        );
      }

      setFormData(initialFormData);
      setEditingId(null);

      fetchCustomers();

    } catch (error) {
      console.error(error.response?.data || error);
      setError("Unable to save customer.");
    }
  };

  // -----------------------------
  // EDIT
  // -----------------------------

  const handleEdit = (customer) => {
    setEditingId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`customers/${id}/`);

      fetchCustomers();

    } catch (error) {
      console.error(error.response?.data || error);

      setError(
        "Unable to delete customer. The customer may have existing sales."
      );
    }
  };

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div>

      <h1>Customers</h1>

      <h2>
        {editingId
          ? "Edit Customer"
          : "Add Customer"}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Customer Name: </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Phone: </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Address: </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          {editingId
            ? "Update Customer"
            : "Add Customer"}
        </button>

        {editingId && (
          <>
            {" "}

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}

      </form>

      {error && <p>{error}</p>}

      <hr />

      <h2>Customer List</h2>

      {customers.length === 0 ? (
        <p>No customers available.</p>
      ) : (
        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
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

                <td>{customer.address}</td>

                <td>

                  <button
                    onClick={() =>
                      handleEdit(customer)
                    }
                  >
                    Edit
                  </button>

                  {" "}

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
  );
}

export default Customers;