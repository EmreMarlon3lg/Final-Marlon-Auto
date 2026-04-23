import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";

export default function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const linkClass = "font-medium transition-colors duration-200";

  const navLinkClass = ({ isActive }) =>
    `${linkClass} ${
      isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

  // 🔹 Вземаме логнатия user + role от profiles
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };

    loadUser();

    // слушаме за login / logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Marlon <span className="text-blue-600">Auto</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/cars" className={navLinkClass}>
              Автомобили
            </NavLink>
            <NavLink to="/electric" className={navLinkClass}>
              Електрически автомобили
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Услуги
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              За нас
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 transition text-lg"
              title="Търсене"
            >
              🔍
            </Link>

            {/* 🔐 Админ бутон – САМО ако role = admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Админ панел
              </Link>
            )}

            {/* Профил / Logout */}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition text-sm font-medium"
              >
                Изход
              </button>
            ) : (
              <Link
                to="/account"
                className="text-gray-700 hover:text-blue-600 transition text-lg"
              >
                👤
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
