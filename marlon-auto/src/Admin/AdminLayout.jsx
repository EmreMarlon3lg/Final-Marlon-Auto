import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        "block rounded-xl px-4 py-2 text-sm font-semibold transition " +
        (isActive
          ? "bg-blue-600 text-white"
          : "text-gray-800 hover:bg-gray-100")
      }
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-500">Marlon Auto</div>
                  <div className="text-lg font-bold text-gray-900">Admin Panel</div>
                </div>
                <button
                  onClick={onLogout}
                  className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                >
                  Изход
                </button>
              </div>

              <div className="mt-5 space-y-2">
                <Item to="/admin">Dashboard</Item>
                <Item to="/admin/cars">Автомобили</Item>
                <Item to="/admin/users">Потребители</Item>
                <Item to="/admin/logs">Логове</Item>
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4 text-xs text-blue-900">
                Само админи имат достъп до тази секция.
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
