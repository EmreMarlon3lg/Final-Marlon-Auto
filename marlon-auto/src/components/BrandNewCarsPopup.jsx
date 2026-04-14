import { useEffect, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import Modal from "./Modal";

export default function BrandNewCarsPopup({ open, brand, onClose }) {
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !brand) return;

    let alive = true;

    async function loadCars() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("cars")
        .select(
          "id, brand, model, year, price_eur, main_image_url, created_at"
        )
        .eq("brand", brand)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!alive) return;

      if (error) {
        setError(error.message);
        setCars([]);
      } else {
        setCars(data || []);
      }

      setLoading(false);
    }

    loadCars();

    return () => {
      alive = false;
    };
  }, [open, brand]);

  return (
    <Modal open={open} onClose={onClose} title={`Нови предложения • ${brand}`}>
      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border bg-white p-4"
            >
              <div className="h-40 w-full rounded-lg bg-gray-200" />
              <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Грешка при зареждане: {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && cars.length === 0 && (
        <div className="rounded-xl border bg-gray-50 p-4 text-gray-700">
          Няма налични автомобили за марка <b>{brand}</b>.
        </div>
      )}

      {/* Cars */}
      {!loading && !error && cars.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => {
            const img = c.main_image_url || null;

            return (
              <div
                key={c.id}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-44 w-full bg-gray-100">
                  {img ? (
                    <img
                      src={img}
                      alt={`${c.brand} ${c.model}`}
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Няма снимка
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900">
                      {c.brand} {c.model}
                    </h4>
                    {c.year && (
                      <span className="text-xs font-semibold text-gray-500">
                        {c.year}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {c.price_eur != null
                        ? `${Number(c.price_eur).toLocaleString("bg-BG")} €`
                        : "Цена: -"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
