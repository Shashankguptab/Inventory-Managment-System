import { useEffect, useState } from "react";
import api from "../api/axios";

function Sales() {
  // -----------------------------
  // STATE
  // -----------------------------

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");

  const [items, setItems] = useState([
    {
      product: "",
      quantity: "",
      unit_price: "",
    },
  ]);

  // -----------------------------
  // FETCH SALES
  // -----------------------------

  const fetchSales = async () => {
    try {
      const response = await api.get("sales/");
      setSales(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load sales.");
    }
  };

  // -----------------------------
  // FETCH CUSTOMERS
  // -----------------------------

  const fetchCustomers = async () => {
    try {
      const response = await api.get("customers/");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // -----------------------------
  // FETCH PRODUCTS
  // -----------------------------

  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // -----------------------------
  // LOAD DATA WHEN PAGE OPENS
  // -----------------------------

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  // -----------------------------
  // HANDLE ITEM INPUT
  // -----------------------------

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];

    updatedItems[index][e.target.name] =
      e.target.value;

    setItems(updatedItems);
  };

  // -----------------------------
  // ADD ANOTHER PRODUCT
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
  // REMOVE PRODUCT
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
  // CREATE SALE
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const saleData = {
      customer: customer,
      items: items,
    };

    try {
      await api.post("sales/", saleData);

      // Clear form
      setCustomer("");

      setItems([
        {
          product: "",
          quantity: "",
          unit_price: "",
        },
      ]);

      // Refresh data
      await fetchSales();
      await fetchProducts();

    } catch (error) {
      console.error(
        error.response?.data || error
      );

      const backendError =
        error.response?.data?.stock;

      if (backendError) {
        setError(backendError);
      } else {
        setError("Unable to create sale.");
      }
    }
  };

  // -----------------------------
  // CALCULATE TOTAL
  // -----------------------------

  const calculateTotal = (saleItems) => {
    return saleItems.reduce(
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

      <h1>Sales</h1>

      <h2>Create Sale</h2>

      <form onSubmit={handleSubmit}>

        {/* CUSTOMER */}

        <div>
          <label>Customer: </label>

          <select
            value={customer}
            onChange={(e) =>
              setCustomer(e.target.value)
            }
            required
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}

          </select>
        </div>

        <br />

        {/* SALE ITEMS */}

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
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                  {" "}
                  (Stock: {product.quantity})
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
              placeholder="Selling Price"
              value={item.unit_price}
              onChange={(e) =>
                handleItemChange(index, e)
              }
              required
            />

            {" "}

            <button
              type="button"
              onClick={() =>
                removeItem(index)
              }
            >
              Remove
            </button>

            <br />
            <br />

          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
        >
          Add Another Product
        </button>

        <br />
        <br />

        <button type="submit">
          Create Sale
        </button>

      </form>

      {error && (
        <p>
          {error}
        </p>
      )}

      <hr />

      {/* SALES HISTORY */}

      <h2>Sales History</h2>

      {sales.length === 0 ? (
        <p>No sales available.</p>
      ) : (
        sales.map((sale) => (

          <div key={sale.id}>

            <h3>
              Sale #{sale.id}
            </h3>

            <p>
              Customer: {sale.customer_name}
            </p>

            <p>
              Date:{" "}
              {new Date(
                sale.sale_date
              ).toLocaleString()}
            </p>

            <table
              border="1"
              cellPadding="8"
            >

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Selling Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>

                {sale.items.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.product_name}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      ₹{item.unit_price}
                    </td>

                    <td>
                      ₹
                      {(
                        Number(item.quantity) *
                        Number(item.unit_price)
                      ).toFixed(2)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            <h4>
              Total: ₹
              {calculateTotal(
                sale.items
              ).toFixed(2)}
            </h4>

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default Sales;