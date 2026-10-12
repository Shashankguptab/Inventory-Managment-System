import { useEffect, useState } from "react";
import api from "../api/axios";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [supplier, setSupplier] = useState("");

  const [items, setItems] = useState([
    {
      product: "",
      quantity: "",
      unit_price: "",
    },
  ]);

  // FETCH DATA
  const fetchPurchases = async () => {
    try {
      const response = await api.get("purchases/");
      setPurchases(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load purchases.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("suppliers/");
      setSuppliers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
  }, []);

  // -----------------------------
  // HANDLE PURCHASE ITEM CHANGE
  // -----------------------------

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];

    updatedItems[index][e.target.name] =
      e.target.value;

    setItems(updatedItems);
  };

  // -----------------------------
  // ADD ANOTHER PRODUCT ROW
  // -----------------------------

  const addItem = () => {
    setItems([
      ...items,
      {
        product: "",
        quantity: "",
        unit_price: "",
      },
    ]);
  };

  // -----------------------------
  // REMOVE PRODUCT ROW
  // -----------------------------

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    const updatedItems = items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setItems(updatedItems);
  };

  // -----------------------------
  // CREATE PURCHASE
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const purchaseData = {
      supplier: supplier,
      items: items,
    };

    try {
      await api.post(
        "purchases/",
        purchaseData
      );

      // Clear form
      setSupplier("");

      setItems([
        {
          product: "",
          quantity: "",
          unit_price: "",
        },
      ]);

      // Refresh purchase history
      await fetchPurchases();

      // Stock changed, so refresh products
      await fetchProducts();

    } catch (error) {
      console.error(
        error.response?.data || error
      );

      setError("Unable to create purchase.");
    }
  };

  // -----------------------------
  // CALCULATE PURCHASE TOTAL
  // -----------------------------

  const calculateTotal = (purchaseItems) => {
    return purchaseItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity) *
          Number(item.unit_price),
      0
    );
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div>

      <h1>Purchases</h1>
      <h2>Create Purchase</h2>

      <form onSubmit={handleSubmit}>

        {/* SUPPLIER */}

        <div>
          <label>Supplier: </label>

          <select
            value={supplier}
            onChange={(e) =>
              setSupplier(e.target.value)
            }
            required
          >
            <option value=""> Select Supplier</option>

            {suppliers.map((supplier) => (
              <option
                key={supplier.id}
                value={supplier.id}
              >
                {supplier.name}
              </option>
            ))}

          </select>
        </div>

        <br />

        {/* PURCHASE ITEMS */}

        <h3>Products</h3>

        {items.map((item, index) => (
          <div key={index}>

            <select
              name="product"
              value={item.product}
              onChange={(e) =>
                handleItemChange(index, e)
              }
              required
            >
              <option value=""> Select Product</option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}

            </select>

            {" "}

            <input
              type="number"
              name="quantity"
              min="1"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, e)
              }
              required
            />

            {" "}

            <input
              type="number"
              name="unit_price"
              min="0"
              step="0.01"
              placeholder="Unit Cost"
              value={item.unit_price}
              onChange={(e) =>
                handleItemChange(index, e)
              }
              required
            />

            {" "}

            <button type="button"onClick={() =>removeItem(index)}>Remove</button>
  
            <br />
            <br />

          </div>
        ))}

        <button type="button"onClick={addItem}>Add Another Produce</button>

        <br />
        <br />

        <button type="submit">Create Purchase</button>

      </form>

      {error && <p>{error}</p>}
      <hr />

      {/* PURCHASE HISTORY */}

      <h2>Purchase History</h2>
      {purchases.length === 0 ? (
        <p>No purchases available.</p>
      ) : (
        purchases.map((purchase) => (

          <div key={purchase.id}>
            <h3>Purchase #{purchase.id}</h3>
            <p>Supplier:{" "}{purchase.supplier_name}</p>

            <p>Date:{" "}{new Date(purchase.purchase_date).toLocaleString()}</p>

            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>

                {purchase.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unit_price}</td>
                    <td>₹{(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4> Total: ₹{calculateTotal( purchase.items ).toFixed(2)} </h4>
            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default Purchases;