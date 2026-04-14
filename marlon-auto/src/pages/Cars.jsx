import { useEffect, useMemo, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import CarCard from "../components/CarCard";

const SECTION = [
  { key: "petrol", title: "Бензинови автомобили" },
  { key: "diesel", title: "Дизелови автомобили" },
  { key: "hybrid", title: "Хибридни автомобили" },
];

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_published", true)
        .in("fuel_type", ["petrol", "diesel", "hybrid"])
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setCars([]);
      } else {
        setCars(data ?? []);
      }

      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter((c) => {
      const text = `${c.title} ${c.brand} ${c.model} ${c.year}`.toLowerCase();
      return text.includes(q);
    });
  }, [cars, query]);

  const grouped = useMemo(() => {
    const map = { petrol: [], diesel: [], hybrid: [] };
    for (const c of filtered) map[c.fuel_type]?.push(c);
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-14">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Автомобили
          </h1>
          <p className="text-gray-200 max-w-2xl">
            Бензинови, дизелови и хибридни автомобили — подбрани предложения с ясна информация и премиум обслужване.
          </p>

          <div className="mt-8 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Търси по марка, модел, година..."
              className="w-full px-4 py-3 rounded-xl text-gray-900 outline-none"
            />
            <p className="text-xs text-gray-400 mt-2">* Търсенето филтрира резултатите в секциите.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-gray-600">Зареждане...</div>
        ) : (
          SECTION.map((s) => (
            <div key={s.key} className="mb-14">
              <div className="flex items-end justify-between gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{s.title}</h2>
                <div className="text-sm text-gray-500">
                  {grouped[s.key].length} резултата
                </div>
              </div>

              {grouped[s.key].length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
                  Няма налични предложения в тази категория в момента.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {grouped[s.key].map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
