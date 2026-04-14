import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../Supabase/supabaseClient";

const empty = {
  title: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price_eur: 0,
  fuel_type: "petrol",
  transmission: "",
  drivetrain: "",
  mileage_km: "",
  engine_cc: "",
  power_hp: "",
  torque_nm: "",
  consumption_l_100: "",
  range_km: "",
  battery_kwh: "",
  charging_kw: "",
  description: "",
  main_image_url: "",
  category: "regular",
  status: "active",
};

export default function CarFormModal({ open, onClose, car, onSaved }) {
  const mode = car?.id ? "edit" : "create";
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!open) return;
    setMsg(null);

    if (car?.id) {
      setForm({
        ...empty,
        ...car,
        year: car.year ?? empty.year,
        price_eur: car.price_eur ?? 0,
        category: car.category ?? (String(car.fuel_type || "").includes("electric") ? "electric" : "regular"),
        status: car.status ?? (car.is_published ? "active" : "inactive"),
      });
    } else {
      setForm(empty);
    }
  }, [open, car]);

  const title = useMemo(() => (mode === "create" ? "Добави кола" : "Редакция на кола"), [mode]);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      price_eur: Number(form.price_eur) || 0,
      fuel_type: String(form.fuel_type || "").trim(),
      transmission: form.transmission || null,
      drivetrain: form.drivetrain || null,
      mileage_km: form.mileage_km === "" ? null : Number(form.mileage_km),
      engine_cc: form.engine_cc === "" ? null : Number(form.engine_cc),
      power_hp: form.power_hp === "" ? null : Number(form.power_hp),
      torque_nm: form.torque_nm === "" ? null : Number(form.torque_nm),
      consumption_l_100: form.consumption_l_100 === "" ? null : Number(form.consumption_l_100),
      range_km: form.range_km === "" ? null : Number(form.range_km),
      battery_kwh: form.battery_kwh === "" ? null : Number(form.battery_kwh),
      charging_kw: form.charging_kw === "" ? null : Number(form.charging_kw),
      description: form.description || null,
      main_image_url: form.main_image_url || null,

      // ✅ новите полета
      category: form.category,
      status: form.status,

      // ✅ backward compatibility (ако някъде още ползваш is_published)
      is_published: form.status === "active",
    };

    try {
      if (mode === "create") {
        const { data, error } = await supabase
          .from("cars")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setMsg({ type: "success", text: "Добавено ✅" });
        setSaving(false);
        onSaved?.({ mode: "create", old_data: null, new_data: data });
        return;
      } else {
        const old_data = car;

        const { data, error } = await supabase
          .from("cars")
          .update(payload)
          .eq("id", car.id)
          .select()
          .single();

        if (error) throw error;

        setMsg({ type: "success", text: "Запазено ✅" });
        setSaving(false);
        onSaved?.({ mode: "edit", old_data, new_data: data });
        return;
      }
    } catch (err) {
      console.log("CarForm save error:", err);
      setMsg({ type: "error", text: err.message || "Грешка при запис." });
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <div className="text-lg font-bold text-gray-900">{title}</div>
            <div className="text-xs text-gray-500">Попълни полетата и запази.</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Затвори
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {msg?.text && (
            <div
              className={
                "mb-4 rounded-xl px-4 py-3 text-sm " +
                (msg.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800")
              }
            >
              {msg.text}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-800">Title</label>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="regular">regular</option>
                  <option value="electric">electric</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="reserved">reserved</option>
                  <option value="sold">sold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Model</label>
              <input
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setField("year", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Price EUR</label>
                <input
                  type="number"
                  value={form.price_eur}
                  onChange={(e) => setField("price_eur", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Fuel type</label>
              <select
                value={form.fuel_type}
                onChange={(e) => setField("fuel_type", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="petrol">petrol</option>
                <option value="diesel">diesel</option>
                <option value="hybrid">hybrid</option>
                <option value="electric">electric</option>
                <option value="Бензин">Бензин</option>
                <option value="Дизел">Дизел</option>
                <option value="Хибрид">Хибрид</option>
                <option value="Електрически">Електрически</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Main image URL</label>
              <input
                value={form.main_image_url || ""}
                onChange={(e) => setField("main_image_url", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-800">Mileage km</label>
                <input
                  type="number"
                  value={form.mileage_km}
                  onChange={(e) => setField("mileage_km", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Power hp</label>
                <input
                  type="number"
                  value={form.power_hp}
                  onChange={(e) => setField("power_hp", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-800">Description</label>
              <textarea
                rows={4}
                value={form.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
