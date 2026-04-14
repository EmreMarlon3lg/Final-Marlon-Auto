import { Link } from "react-router-dom";

const fuelLabel = {
  petrol: "Бензин",
  diesel: "Дизел",
  hybrid: "Хибрид",
  electric: "Електрически",
};

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <img
        src={car.main_image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"}
        alt={car.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">{car.title}</h3>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              €{Number(car.price_eur).toLocaleString("de-DE")}
            </div>
            <div className="text-sm text-gray-500">{car.year}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
            {fuelLabel[car.fuel_type] ?? car.fuel_type}
          </span>
          {car.mileage_km != null && (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              {Number(car.mileage_km).toLocaleString("bg-BG")} км
            </span>
          )}
          {car.power_hp != null && (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              {car.power_hp} hp
            </span>
          )}
          {car.torque_nm != null && (
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
              {car.torque_nm} Nm
            </span>
          )}
        </div>

        <div className="mt-5">
          <Link
            to={`/cars/${car.id}`}
            className="text-blue-600 font-semibold hover:underline"
          >
            Разгледайте →
          </Link>
        </div>
      </div>
    </div>
  );
}
