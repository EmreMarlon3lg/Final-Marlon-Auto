import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setMsg({ type: "error", text: "Попълни име, фамилия и телефон." });
      return;
    }

    if (password !== password2) {
      setMsg({ type: "error", text: "Паролите не съвпадат." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Паролата трябва да е поне 6 символа." });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) {
      setMsg({ type: "error", text: error.message || "Грешка при регистрация." });
      setLoading(false);
      return;
    }

    // Ако имаш email confirmation: session може да е null.
    // Но trigger-ът вече е записал данните в profiles.
    if (!data?.session) {
      setMsg({
        type: "success",
        text: "Регистрацията е успешна ✅ Провери имейла си за потвърждение, после влез.",
      });
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
          <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
          <p className="mt-1 text-sm text-gray-600">Създай акаунт за Marlon Auto.</p>

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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">Име</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Денис"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Фамилия</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Петров"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Телефон</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+359 88 123 4567"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

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

            <div>
              <label className="text-sm font-semibold text-gray-800">Повтори парола</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
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
              {loading ? "Създаване..." : "Създай акаунт"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Имаш акаунт?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Вход
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
