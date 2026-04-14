import { useEffect, useState } from "react";
import { supabase } from "../../Supabase/supabaseClient";
import { auditLog } from "../lib/audit";

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,phone,role,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("AdminUsers load error:", error);
      setErr(error.message || "Грешка при зареждане.");
      setLoading(false);
      return;
    }

    setUsers(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function changeRole(u, role) {
    if (!confirm(`Сигурен ли си? ${u.email ?? u.full_name ?? u.id} -> ${role}`)) return;

    const old_data = u;

    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", u.id)
      .select()
      .single();

    if (error) {
      alert(error.message || "Грешка при смяна на роля.");
      return;
    }

    await auditLog({
      action: "ROLE_CHANGE",
      entity_type: "user",
      entity_id: u.id,
      old_data,
      new_data: data,
    });

    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Потребители</h1>
          <p className="mt-1 text-sm text-gray-600">Смяна на роли (user/admin).</p>
        </div>

        <button
          onClick={load}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : err ? (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{err}</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{u.full_name || "—"}</div>
                      <div className="text-xs text-gray-500">{u.email || u.id}</div>
                    </td>
                    <td className="px-4 py-3">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => changeRole(u, "user")}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          user
                        </button>
                        <button
                          onClick={() => changeRole(u, "admin")}
                          className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
                        >
                          admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                      Няма потребители.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
