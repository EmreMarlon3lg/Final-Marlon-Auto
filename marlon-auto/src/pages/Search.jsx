import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function Search() {
  const [q, setQ] = useState("");
  const [fuel, setFuel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest"); // newest | price_asc | price_desc | year_desc | mileage_asc

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errText, setErrText] = useState("");

  async function runSearch() {
    setLoading(true);
    setErrText("");

    let query = supabase
      .from("cars")
      .select(
        "id, title, brand, model, year, price_eur, fuel_type, transmission, mileage_km, main_image_url, created_at"
      )
      .eq("status", "active");

    // 🔍 търсене по brand + model
    const text = q.trim();
    if (text) {
      query = query.or(`title.ilike.%${text}%,brand.ilike.%${text}%,model.ilike.%${text}%`);
    }

    // ⛽ филтър гориво
    if (fuel) {
      query = query.eq("fuel_type", fuel);
    }

    // 💶 цена (EUR)
    if (minPrice !== "" && !Number.isNaN(Number(minPrice))) {
      query = query.gte("price_eur", Number(minPrice));
    }
    if (maxPrice !== "" && !Number.isNaN(Number(maxPrice))) {
      query = query.lte("price_eur", Number(maxPrice));
    }

    // ↕️ сортиране
    if (sort === "newest") query = query.order("created_at", { ascending: false });
    if (sort === "price_asc") query = query.order("price_eur", { ascending: true });
    if (sort === "price_desc") query = query.order("price_eur", { ascending: false });
    if (sort === "year_desc") query = query.order("year", { ascending: false });
    if (sort === "mileage_asc") query = query.order("mileage_km", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.log("SEARCH ERROR:", error);
      setErrText(error.message || "Грешка при търсене.");
      setCars([]);
      setLoading(false);
      return;
    }

    setCars(data || []);
    setLoading(false);
  }

  // първоначално зареждане
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce при промяна на филтрите
  useEffect(() => {
    const t = setTimeout(() => {
      runSearch();
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, fuel, minPrice, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Търсене</h1>
        <p className="mt-1 text-sm text-gray-600">
          Търси по марка/модел и филтрирай по гориво и цена.
        </p>

        {/* Filters */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="text-sm font-semibold text-gray-800">Марка / модел</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Пример: BMW, Audi, E90..."
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-semibold text-gray-800">Гориво</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
            >
                <option value="">Всички</option>
                <option value="petrol">Бензин</option>
                <option value="diesel">Дизел</option>
                <option value="hybrid">Хибрид</option>
                <option value="electric">Електрически</option>
               </select>

            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-800">Мин. цена (€)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-800">Макс. цена (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="50000"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="text-sm font-semibold text-gray-800">Сортиране</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              >
                <option value="newest">Най-нови</option>
                <option value="price_asc">Цена ↑</option>
                <option value="price_desc">Цена ↓</option>
                <option value="year_desc">Година ↓</option>
                <option value="mileage_asc">Пробег ↑</option>
              </select>
            </div>

            <div className="md:col-span-8 flex items-end justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setFuel("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("newest");
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Изчисти
              </button>

              <button
                type="button"
                onClick={runSearch}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Търси
              </button>
            </div>
          </div>

          {errText && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {errText}
            </div>
          )}

          {!errText && (
            <div className="mt-4 text-sm text-gray-600">
              {loading ? "Търсене..." : `Намерени: ${cars.length}`}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[310px] animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
              />
            ))}

          {!loading && cars.length === 0 && !errText && (
            <div className="rounded-2xl bg-white p-8 text-gray-600 shadow-sm ring-1 ring-gray-100">
              Няма резултати по зададените филтри.
            </div>
          )}

          {!loading &&
            cars.map((car) => {
              const title = `${car.brand ?? ""} ${car.model ?? ""}`.trim();

              return (
                <Link
                  key={car.id}
                  to={`/cars/${car.id}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                >
                  <div className="h-44 w-full bg-gray-100">
                    {car.main_image_url ? (
                      <img
                        src={car.main_image_url}
                        alt={title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {car.year ? `${car.year} • ` : ""}
                      {car.fuel_type ?? "—"}
                      {car.transmission ? ` • ${car.transmission}` : ""}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-semibold text-blue-600">
                        €{Number(car.price_eur ?? 0).toLocaleString()}
                      </div>

                      {car.mileage_km != null ? (
                        <div className="text-xs text-gray-500">
                          {Number(car.mileage_km).toLocaleString()} km
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
