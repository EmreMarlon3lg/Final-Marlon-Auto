import { useEffect, useMemo, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import CarCard from "../components/CarCard";

export default function Electric() {
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
        .eq("fuel_type", "electric")
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-14">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Електрически автомобили
          </h1>
          <p className="text-gray-200 max-w-2xl">
            Само електромобили — пробег, батерия и зареждане показани ясно, за да избереш уверено.
          </p>

          <div className="mt-8 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Търси електромобил по марка, модел, година..."
              className="w-full px-4 py-3 rounded-xl text-gray-900 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-gray-600">Зареждане...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-gray-600">
            Няма налични електрически предложения в момента.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
