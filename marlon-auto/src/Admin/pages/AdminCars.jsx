import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../Supabase/supabaseClient";
import { auditLog } from "../lib/audit";
import CarFormModal from "./CarFormModal";

const CATEGORY_OPTIONS = [
  { key: "all", label: "Всички" },
  { key: "regular", label: "Автомобили" },
  { key: "electric", label: "Електрически" },
];

const STATUS_OPTIONS = [
  { key: "all", label: "Всички" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "reserved", label: "Reserved" },
  { key: "sold", label: "Sold" },
];

export default function AdminCars() {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return cars.filter((c) => {
      const okCat = category === "all" ? true : (c.category === category);
      const okSt = status === "all" ? true : (c.status === status);
      const okTxt = !text
        ? true
        : `${c.title ?? ""} ${c.brand ?? ""} ${c.model ?? ""}`
            .toLowerCase()
            .includes(text);
      return okCat && okSt && okTxt;
    });
  }, [cars, q, category, status]);

  async function load() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("cars")
      .select(
        "id,title,brand,model,year,price_eur,fuel_type,transmission,drivetrain,mileage_km,engine_cc,power_hp,torque_nm,consumption_l_100,range_km,battery_kwh,charging_kw,description,main_image_url,is_published,category,status,created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.log("AdminCars load error:", error);
      setError(error.message || "Грешка при зареждане.");
      setLoading(false);
      return;
    }

    // ако някой ред няма category/status (при стари данни) -> derived
    const normalized = (data ?? []).map((c) => ({
      ...c,
      category:
        c.category ??
        (String(c.fuel_type || "").toLowerCase().includes("electric") ? "electric" : "regular"),
      status: c.status ?? (c.is_published ? "active" : "inactive"),
    }));

    setCars(normalized);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(car) {
    setEditing(car);
    setModalOpen(true);
  }

  async function onDelete(car) {
    if (!confirm(`Сигурен ли си, че искаш да изтриеш: ${car.title}?`)) return;

    const old_data = car;

    const { error } = await supabase.from("cars").delete().eq("id", car.id);

    if (error) {
      alert(error.message || "Грешка при изтриване.");
      return;
    }

    await auditLog({
      action: "CAR_DELETE",
      entity_type: "car",
      entity_id: car.id,
      old_data,
      new_data: null,
    });

    setCars((prev) => prev.filter((x) => x.id !== car.id));
  }

  async function onSaved({ mode, old_data, new_data }) {
    await auditLog({
      action: mode === "create" ? "CAR_CREATE" : "CAR_UPDATE",
      entity_type: "car",
      entity_id: new_data?.id,
      old_data,
      new_data,
    });

    setModalOpen(false);
    setEditing(null);
    await load();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Автомобили</h1>
          <p className="mt-1 text-sm text-gray-600">
            Добавяй, редактирай и управлявай статусите.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Добави кола
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Търси (title/brand/model)"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={load}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price (EUR)</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Fuel</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{c.title}</div>
                      <div className="text-xs text-gray-500">
                        {c.brand} · {c.model}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                        {c.category}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">{Number(c.price_eur || 0).toFixed(0)}</td>
                    <td className="px-4 py-3">{c.year}</td>
                    <td className="px-4 py-3">{c.fuel_type}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(c)}
                          className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                      Няма резултати.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CarFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        car={editing}
        onSaved={onSaved}
      />
    </div>
  );
}
