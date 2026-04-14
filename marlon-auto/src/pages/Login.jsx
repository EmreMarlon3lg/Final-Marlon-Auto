import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg({ type: "error", text: error.message || "Грешка при вход." });
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/account");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-6 py-14">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Вход</h1>
          <p className="mt-1 text-sm text-gray-600">
            Влез в профила си в Marlon Auto.
          </p>

          {msg?.text && (
            <div
              className={
                "mt-4 rounded-xl px-4 py-3 text-sm " +
                (msg.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800")
              }
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Парола</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Влизане..." : "Вход"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Нямаш акаунт?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Регистрация
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
