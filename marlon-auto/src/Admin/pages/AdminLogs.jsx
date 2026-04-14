import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../Supabase/supabaseClient";

function fmt(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export default function AdminLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("audit_logs")
      .select("id,actor_id,action,entity_type,entity_id,created_at,old_data,new_data")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.log("AdminLogs load error:", error);
      setErr(error.message || "Грешка при зареждане.");
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    setLogs(rows);

    // map actor_id -> profile
    const ids = Array.from(new Set(rows.map((x) => x.actor_id).filter(Boolean)));
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,email,full_name")
        .in("id", ids);

      const map = {};
      (profs ?? []).forEach((p) => (map[p.id] = p));
      setProfilesById(map);
    } else {
      setProfilesById({});
    }

    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const view = useMemo(() => logs, [logs]);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Логове</h1>
          <p className="mt-1 text-sm text-gray-600">Последни админ действия.</p>
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
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : err ? (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{err}</div>
      ) : (
        <div className="mt-6 space-y-3">
          {view.map((l) => {
            const actor = l.actor_id ? profilesById[l.actor_id] : null;
            const actorLabel = actor?.email || actor?.full_name || l.actor_id || "—";

            return (
              <div key={l.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-bold text-gray-900">
                    {l.action} · {l.entity_type}
                  </div>
                  <div className="text-xs text-gray-500">{fmt(l.created_at)}</div>
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-semibold">Actor:</span> {actorLabel}
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-semibold">Entity ID:</span> {l.entity_id || "—"}
                </div>

                {(l.old_data || l.new_data) && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-blue-700">
                      Details (old/new)
                    </summary>
                    <div className="mt-2 grid gap-3 md:grid-cols-2">
                      <pre className="overflow-auto rounded-xl bg-gray-50 p-3 text-xs text-gray-800">
{JSON.stringify(l.old_data, null, 2)}
                      </pre>
                      <pre className="overflow-auto rounded-xl bg-gray-50 p-3 text-xs text-gray-800">
{JSON.stringify(l.new_data, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            );
          })}

          {view.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm ring-1 ring-gray-100">
              Няма логове.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
