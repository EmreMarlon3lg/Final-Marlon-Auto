import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ix3Hero from "../assets/bmw_ix3.jpg";

import BrandNewCarsPopup from "../components/BrandNewCarsPopup";

export default function Home() {
  // iX3 modal
  const [openIx3, setOpenIx3] = useState(false);

  // Brand popup modal
  const [brandPopupOpen, setBrandPopupOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const openBrandPopup = (brand) => {
    setSelectedBrand(brand);
    setBrandPopupOpen(true);
  };

  const closeBrandPopup = () => {
    setBrandPopupOpen(false);
    setSelectedBrand(null);
  };

  // ESC + lock scroll за iX3 модала (само него, за да не се бие с другия Modal)
  useEffect(() => {
    if (!openIx3) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenIx3(false);
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIx3]);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* 2. Главен промоционален банер */}
        <section className="relative h-[90vh]">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ix3Hero})` }}
          />

          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
                Новият <span className="text-blue-400">IX3</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Началото на една нова ера. Електрическото шофиране в своята
                най-съвършена форма.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setOpenIx3(true)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Прочети повече
                </button>

                <Link
                  to="/cars"
                  className="px-8 py-3 border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition"
                >
                  Намерете оферта
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Секция с модели/промоции */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Нови предложения
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* BMW */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
                alt="BMW Серия 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Новата Серия 3</h3>
                <p className="text-gray-600 mb-4">
                  Динамика и иновации в компактен седан.
                </p>

                <button
                  type="button"
                  onClick={() => openBrandPopup("BMW")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Разгледайте →
                </button>
              </div>
            </div>

            {/* Mercedes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img
                src="https://www.topgear.com/sites/default/files/cars-car/inline-gallery/2025/05/Original-49014-mercedes-e53-amg-saloon-0002_0.jpg"
                alt="Mercedes"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Нови Mercedes</h3>
                <p className="text-gray-600 mb-4">
                  Лукс, комфорт и технологии от ново поколение.
                </p>

                <button
                  type="button"
                  onClick={() => openBrandPopup("Mercedes")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Разгледайте →
                </button>
              </div>
            </div>

            {/* Audi */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img
                src="https://uploads.audi-mediacenter.com/system/production/media/122631/images/407644abfb62752b795fb99173261d6c464bd7fa/A240553_blog.jpg?1733133118"
                alt="Audi"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Нови Audi</h3>
                <p className="text-gray-600 mb-4">
                  Премиум дизайн и динамика без компромиси.
                </p>

                <button
                  type="button"
                  onClick={() => openBrandPopup("Audi")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Разгледайте →
                </button>
              </div>
            </div>

            {/* Toyota */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img
                src="https://www.toyota.bg/content/dam/toyota/nmsc/bulgaria/cars/hil0006b_20_1920x1080px.jpg.thumb.1280.1280.png"
                alt="Toyota"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Нови Toyota</h3>
                <p className="text-gray-600 mb-4">
                  Надеждност, хибридни технологии и нисък разход.
                </p>

                <button
                  type="button"
                  onClick={() => openBrandPopup("Toyota")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Разгледайте →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Секция с предимства */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Защо да изберете Marlon Auto?
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Официален дилър",
                  text: "Гаранция за качество и пълна поддръжка.",
                },
                {
                  icon: "🔋",
                  title: "Електрически модели",
                  text: "Широк избор от електромобили и технология.",
                },
                {
                  icon: "🛠️",
                  title: "Изключителни услуги",
                  text: "Персонално обслужване и консултации.",
                },
                {
                  icon: "💰",
                  title: "Финансови решения",
                  text: "Гъвкави опции за лизинг и кредитиране.",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* BRAND POPUP: нови автомобили по марка */}
      <BrandNewCarsPopup
        open={brandPopupOpen}
        brand={selectedBrand}
        onClose={closeBrandPopup}
      />

      {/* iX3 Modal */}
      {openIx3 && (
        <div
          className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenIx3(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">BMW iX3</h3>
                <p className="text-gray-600">
                  Електрически SUV • Premium комфорт • Ежедневна практичност
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenIx3(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                aria-label="Затвори"
                title="Затвори (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left image */}
              <div className="bg-gray-100">
                <img
                  src={ix3Hero}
                  alt="BMW iX3"
                  className="w-full h-full object-cover max-h-[70vh] lg:max-h-[92vh]"
                />
              </div>

              {/* Right info */}
              <div className="p-6 overflow-y-auto max-h-[70vh] lg:max-h-[92vh]">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    100% Electric
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    SUV
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    Автоматик
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    Задно предаване
                  </span>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Какво прави iX3 специален?
                </h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  BMW iX3 комбинира премиум комфорт, модерни технологии и безшумно
                  електрическо шофиране. Подходящ е както за градски условия, така
                  и за по-дълги пътувания, като осигурява плавно ускорение и
                  усещане за истинско BMW.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: "Мощност", value: "286 к.с." },
                    { label: "Ускорение 0–100", value: "~6.8 сек" },
                    { label: "Батерия", value: "~74 kWh (нето)" },
                    { label: "Пробег (WLTP)", value: "до ~460 км" },
                    { label: "Зареждане DC", value: "до ~150 kW" },
                    { label: "Купе", value: "5 места / 5 врати" },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500">{s.label}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Основни акценти
                </h4>
                <ul className="space-y-2 text-gray-600 mb-8">
                  <li>• Тихо и плавно електрическо ускорение.</li>
                  <li>• Практичен SUV с удобен салон и багажник.</li>
                  <li>• Модерни системи за асистенция и безопасност.</li>
                  <li>• Бързо DC зареждане за дълги пътувания.</li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/cars"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-center"
                    onClick={() => setOpenIx3(false)}
                  >
                    Виж всички автомобили
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-3 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-lg font-semibold transition text-center"
                    onClick={() => setOpenIx3(false)}
                  >
                    Запитване за iX3
                  </Link>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                  * Показаните стойности са ориентировъчни и могат да варират
                  според конфигурация и условия.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Футър */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-2">
                Marlon <span className="text-blue-400">Auto</span>
              </div>
              <p className="text-gray-400">
                Marlon Auto – Караш с увереност. Избираш с доверие.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-300">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-300">
                Instagram
              </a>
              <a href="#" className="hover:text-blue-300">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Marlon Auto. Всички права запазени.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
