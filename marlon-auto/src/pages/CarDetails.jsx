import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

const fuelLabel = {
  petrol: "Бензин",
  diesel: "Дизел",
  hybrid: "Хибрид",
  electric: "Електрически",
};

function Spec({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);

      const { data: carData, error: carErr } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      const { data: imgData, error: imgErr } = await supabase
        .from("car_images")
        .select("*")
        .eq("car_id", id)
        .order("sort_order", { ascending: true });

      if (!isMounted) return;

      if (carErr) {
        console.error(carErr);
        setCar(null);
      } else {
        setCar(carData);
      }

      if (imgErr) {
        console.error(imgErr);
        setImages([]);
      } else {
        setImages(imgData ?? []);
      }

      setActive(0);
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const gallery = useMemo(() => {
    const urls = (images ?? []).map((x) => x.url).filter(Boolean);
    if (urls.length > 0) return urls;
    if (car?.main_image_url) return [car.main_image_url];
    return [];
  }, [images, car]);

  if (loading) {
    return <div className="p-10 text-gray-600">Зареждане...</div>;
  }

  if (!car) {
    return (
      <div className="p-10">
        <div className="text-2xl font-bold mb-2">Колата не е намерена</div>
        <Link to="/cars" className="text-blue-600 font-semibold hover:underline">
          ← Обратно към автомобили
        </Link>
      </div>
    );
  }

  const isElectric = car.fuel_type === "electric";

  return (
    <div className="min-h-screen bg-white">
      {/* Top */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-10">
          <Link to={isElectric ? "/electric" : "/cars"} className="text-gray-200 hover:text-white">
            ← Назад
          </Link>

          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{car.title}</h1>
              <div className="mt-2 text-gray-200">
                {car.brand} • {car.model} • {car.year} • {fuelLabel[car.fuel_type] ?? car.fuel_type}
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-3xl font-extrabold">
                €{Number(car.price_eur).toLocaleString("de-DE")}
              </div>
              <div className="text-gray-300">Цена в евро</div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div>
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {gallery.length > 0 ? (
                <img
                  src={gallery[Math.min(active, gallery.length - 1)]}
                  alt={car.title}
                  className="w-full h-[380px] object-cover"
                />
              ) : (
                <div className="h-[380px] flex items-center justify-center text-gray-500">
                  Няма снимки
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.slice(0, 8).map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`rounded-xl overflow-hidden border transition ${
                      idx === active ? "border-blue-600" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Характеристики</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Spec label="Гориво" value={fuelLabel[car.fuel_type] ?? car.fuel_type} />
              <Spec label="Пробег" value={car.mileage_km != null ? `${Number(car.mileage_km).toLocaleString("bg-BG")} км` : "—"} />
              <Spec label="Мощност" value={car.power_hp != null ? `${car.power_hp} hp` : "—"} />
              <Spec label="Въртящ момент" value={car.torque_nm != null ? `${car.torque_nm} Nm` : "—"} />
              <Spec label="Скоростна кутия" value={car.transmission} />
              <Spec label="Задвижване" value={car.drivetrain} />

              {!isElectric && (
                <>
                  <Spec label="Кубатура" value={car.engine_cc != null ? `${car.engine_cc} cc` : "—"} />
                  <Spec label="Разход (среден)" value={car.consumption_l_100 != null ? `${car.consumption_l_100} л/100` : "—"} />
                </>
              )}

              {isElectric && (
                <>
                  <Spec label="Пробег (WLTP)" value={car.range_km != null ? `${car.range_km} км` : "—"} />
                  <Spec label="Батерия" value={car.battery_kwh != null ? `${car.battery_kwh} kWh` : "—"} />
                  <Spec label="DC зареждане" value={car.charging_kw != null ? `${car.charging_kw} kW` : "—"} />
                  <Spec label="Двигател (cc)" value="—" />
                </>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3">Описание</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {car.description || "Няма добавено описание за този автомобил."}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-center"
              >
                Запитване
              </Link>
              <Link
                to={isElectric ? "/electric" : "/cars"}
                className="px-6 py-3 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-lg font-semibold transition text-center"
              >
                Виж още
              </Link>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Данните са информативни и зависят от конкретната конфигурация.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
