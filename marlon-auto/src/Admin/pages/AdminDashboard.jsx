import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../Supabase/supabaseClient";

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="text-sm font-semibold text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{value ?? "—"}</div>
      {hint && <div className="mt-2 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    reserved: 0,
    sold: 0,
    regular: 0,
    electric: 0,
    last30: 0,
  });

  const total = useMemo(
    () => stats.active + stats.inactive + stats.reserved + stats.sold,
    [stats]
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      const since = new Date();
      since.setDate(since.getDate() - 30);

      const req = (q) => q.select("id", { count: "exact", head: true });

      const [
        active,
        inactive,
        reserved,
        sold,
        regular,
        electric,
        last30,
      ] = await Promise.all([
        req(supabase.from("cars").eq("status", "active")),
        req(supabase.from("cars").eq("status", "inactive")),
        req(supabase.from("cars").eq("status", "reserved")),
        req(supabase.from("cars").eq("status", "sold")),
        req(supabase.from("cars").eq("category", "regular")),
        req(supabase.from("cars").eq("category", "electric")),
        req(supabase.from("cars").gte("created_at", since.toISOString())),
      ]);

      if (!alive) return;

      setStats({
        active: active.count ?? 0,
        inactive: inactive.count ?? 0,
        reserved: reserved.count ?? 0,
        sold: sold.count ?? 0,
        regular: regular.count ?? 0,
        electric: electric.count ?? 0,
        last30: last30.count ?? 0,
      });

      setLoading(false);
    }

    load();
    return () => (alive = false);
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Бърз преглед на наличността и статуса.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Общо" value={total} hint="Active + Inactive + Reserved + Sold" />
          <StatCard title="Active" value={stats.active} />
          <StatCard title="Inactive" value={stats.inactive} />
          <StatCard title="Reserved" value={stats.reserved} />
          <StatCard title="Sold" value={stats.sold} />
          <StatCard title="Добавени (посл. 30 дни)" value={stats.last30} />
          <StatCard title="Категория: Regular" value={stats.regular} />
          <StatCard title="Категория: Electric" value={stats.electric} />
        </div>
      )}
    </div>
  );
}
