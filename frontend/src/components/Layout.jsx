import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="app-layout">

      <aside className="sidebar">

        <div className="sidebar-header">
          <h2>Inventory</h2>
          <p>Management System</p>
        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Suppliers
          </NavLink>

          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Purchases
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Customers
          </NavLink>

          <NavLink
            to="/sales"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Sales
          </NavLink>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;