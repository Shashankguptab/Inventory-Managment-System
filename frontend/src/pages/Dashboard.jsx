import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  // --------------------------------
  // STATE
  // --------------------------------

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // FETCH DASHBOARD DATA
  // --------------------------------

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        categoriesResponse,
        suppliersResponse,
        customersResponse,
      ] = await Promise.all([
        api.get("products/"),
        api.get("categories/"),
        api.get("suppliers/"),
        api.get("customers/"),
      ]);

      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
      setSuppliers(suppliersResponse.data);
      setCustomers(customersResponse.data);

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to load dashboard data."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --------------------------------
  // LOW STOCK PRODUCTS
  // --------------------------------

  const lowStockProducts = products.filter(
    (product) => product.is_low_stock
  );

  // --------------------------------
  // TOTAL STOCK QUANTITY
  // --------------------------------

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.quantity),
    0
  );

  // --------------------------------
  // TOTAL INVENTORY VALUE
  // --------------------------------

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price) *
        Number(product.quantity),
    0
  );

  // --------------------------------
  // LOADING SCREEN
  // --------------------------------

  if (loading) {
    return (
      <div className="dashboard">

        <div className="dashboard-loading">
          <h2>Loading Dashboard...</h2>

          <p>
            Fetching latest inventory information.
          </p>
        </div>

      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="dashboard">

      {/* DASHBOARD HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your inventory and stock status.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>

      </div>

      {/* ERROR MESSAGE */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* DASHBOARD CARDS */}

      <div className="dashboard-grid">

        {/* PRODUCTS */}

        <div className="stat-card">

          <div className="stat-card-title">
            Total Products
          </div>

          <div className="stat-card-value">
            {products.length}
          </div>

          <div className="stat-card-description">
            Product records
          </div>

        </div>

        {/* CATEGORIES */}

        <div className="stat-card">

          <div className="stat-card-title">
            Categories
          </div>

          <div className="stat-card-value">
            {categories.length}
          </div>

          <div className="stat-card-description">
            Product categories
          </div>

        </div>

        {/* SUPPLIERS */}

        <div className="stat-card">

          <div className="stat-card-title">
            Suppliers
          </div>

          <div className="stat-card-value">
            {suppliers.length}
          </div>

          <div className="stat-card-description">
            Registered suppliers
          </div>

        </div>

        {/* CUSTOMERS */}

        <div className="stat-card">

          <div className="stat-card-title">
            Customers
          </div>

          <div className="stat-card-value">
            {customers.length}
          </div>

          <div className="stat-card-description">
            Registered customers
          </div>

        </div>

        {/* TOTAL STOCK */}

        <div className="stat-card">

          <div className="stat-card-title">
            Total Stock
          </div>

          <div className="stat-card-value">
            {totalStock}
          </div>

          <div className="stat-card-description">
            Units available
          </div>

        </div>

        {/* LOW STOCK */}

        <div
          className={
            lowStockProducts.length > 0
              ? "stat-card warning-card"
              : "stat-card"
          }
        >

          <div className="stat-card-title">
            Low Stock
          </div>

          <div className="stat-card-value">
            {lowStockProducts.length}
          </div>

          <div className="stat-card-description">

            {lowStockProducts.length > 0
              ? "Requires attention"
              : "Stock levels healthy"}

          </div>

        </div>

        {/* INVENTORY VALUE */}

        <div className="stat-card inventory-value-card">

          <div className="stat-card-title">
            Inventory Value
          </div>

          <div className="stat-card-value inventory-value">

            ₹
            {inventoryValue.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}

          </div>

          <div className="stat-card-description">
            Current stock value
          </div>

        </div>

      </div>

      {/* LOW STOCK SECTION */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Low Stock Products
            </h2>

            <p>
              Products at or below their configured
              stock threshold.
            </p>

          </div>

          <span className="low-stock-count">
            {lowStockProducts.length}
          </span>

        </div>

        {/* EMPTY STATE */}

        {lowStockProducts.length === 0 ? (

          <div className="empty-state">

            <h3>
              Inventory looks healthy
            </h3>

            <p>
              No products are currently below
              their low-stock threshold.
            </p>

          </div>

        ) : (

          /* LOW STOCK TABLE */

          <div className="table-container">

            <table className="dashboard-table">

              <thead>

                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {lowStockProducts.map(
                  (product) => (

                    <tr key={product.id}>

                      <td className="product-name">
                        {product.name}
                      </td>

                      <td>
                        {product.sku}
                      </td>

                      <td>
                        {product.category_name}
                      </td>

                      <td>
                        {product.quantity}
                      </td>

                      <td>
                        {product.low_stock_threshold}
                      </td>

                      <td>

                        <span className="status-badge">
                          Low Stock
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;