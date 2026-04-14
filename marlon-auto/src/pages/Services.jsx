import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import PlanModal from "../components/PlanModal";

export default function Services() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("basic");

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [planSaving, setPlanSaving] = useState(false);

  const [toast, setToast] = useState(null); // {type, text}

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.log("getUser error:", error);

      const u = data?.user ?? null;
      if (!alive) return;
      setUser(u);

      if (u) {
        const { data: prof, error: profErr } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", u.id)
          .maybeSingle();

        if (profErr) console.log("plan load error:", profErr);
        if (alive) setCurrentPlan(prof?.plan ?? "basic");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function buyPlan(planKey) {
    if (!user) {
      navigate("/login");
      return;
    }

    setPlanSaving(true);
    setToast(null);

    const { error } = await supabase
      .from("profiles")
      .update({ plan: planKey })
      .eq("id", user.id);

    if (error) {
      console.log("PLAN BUY ERROR:", error);
      setToast({ type: "error", text: error.message || "Грешка при закупуване." });
      setPlanSaving(false);
      return;
    }

    setCurrentPlan(planKey);
    setPlanSaving(false);
    setPlanModalOpen(false);
    setToast({ type: "success", text: "Честито! Обновихте плана си ✅" });

    // auto-hide
    setTimeout(() => setToast(null), 3500);
  }

  const services = [
    {
      icon: "🔎",
      title: "Подбор на автомобил по поръчка",
      text: "Казвате ни бюджет и изисквания — ние търсим най-добрите оферти и ви предлагаме проверени варианти.",
    },
    {
      icon: "📄",
      title: "Пълна проверка и история",
      text: "Проверяваме VIN, сервизна история, реален пробег, щети и техническо състояние (когато е налично).",
    },
    {
      icon: "🛠️",
      title: "Технически преглед и подготовка",
      text: "Организираме преглед в сервиз, диагностика и препоръки за обслужване преди покупка.",
    },
    {
      icon: "🚚",
      title: "Внос и транспорт",
      text: "Логистика от Европа и организиран транспорт до България — бързо, сигурно и прозрачно.",
    },
    {
      icon: "📝",
      title: "Документи и регистрация",
      text: "Съдействие за всички документи, нотариус, регистрация, номера и застраховки.",
    },
    {
      icon: "💳",
      title: "Лизинг и финансиране",
      text: "Възможности за лизинг/кредит според вашия профил — ясни условия и бърз процес.",
    },
    {
      icon: "🔁",
      title: "Трейд-ин (замяна)",
      text: "Оценка на вашия автомобил и възможност за доплащане към нова кола от нашите предложения.",
    },
    {
      icon: "⚡",
      title: "Консултация за електромобили",
      text: "Съвети за батерия, зареждане, реален пробег, поддръжка и избор на подходящ EV модел.",
    },
  ];

  const steps = [
    { step: "1", title: "Свързвате се с нас", text: "Обсъждаме бюджет, тип автомобил, предпочитания и срок." },
    { step: "2", title: "Подбор и предложения", text: "Изпращаме ви подбрани варианти с ясна информация и насоки." },
    { step: "3", title: "Проверка и потвърждение", text: "Правим проверка/преглед и финализираме избора." },
    { step: "4", title: "Доставка и документи", text: "Организираме транспорт, регистрация и предаване на автомобила." },
  ];

  const packages = [
    {
      key: "basic",
      name: "Basic",
      price: "от 299 лв",
      features: [
        "Консултация и насоки",
        "Подбор на предложения",
        "Проверка на документи (когато са налични)",
        "Поддръжка до финален избор",
      ],
      highlight: false,
    },
    {
      key: "premium",
      name: "Premium",
      price: "от 599 лв",
      features: [
        "Всичко от Basic",
        "Организация на технически преглед",
        "Преговори и съдействие при сделка",
        "Документи и регистрация",
      ],
      highlight: true,
    },
    {
      key: "vip",
      name: "VIP",
      price: "по договаряне",
      features: [
        "Всичко от Premium",
        "Внос и логистика (при нужда)",
        "Приоритетна обработка",
        "Персонален мениджър",
      ],
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: "Колко време отнема процесът?",
      a: "Зависи от модела и изискванията. Обикновено 3–14 дни за подбор и организация. При внос — според логистиката.",
    },
    {
      q: "Мога ли да избера конкретен модел/марка?",
      a: "Да — работим както по конкретен модел, така и по критерии (бюджет, година, пробег, гориво, екстри).",
    },
    {
      q: "Как гарантирате проверката?",
      a: "Проверяваме наличната документация, VIN/история (когато има достъп), и препоръчваме сервизна диагностика преди финал.",
    },
    {
      q: "Предлагате ли лизинг?",
      a: "Да — съдействаме с варианти за финансиране според вашата ситуация и предпочитания.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Toast */}
      {toast?.text && (
        <div className="fixed right-6 top-24 z-[998] max-w-sm rounded-2xl px-4 py-3 shadow-lg ring-1 bg-white">
          <div
            className={
              "text-sm font-semibold " +
              (toast.type === "success" ? "text-green-700" : "text-red-700")
            }
          >
            {toast.text}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Текущ план: <span className="font-semibold">{currentPlan}</span>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Услуги на <span className="text-blue-400">Marlon Auto</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Подбор, проверка, финансиране и цялостно съдействие — за да купувате автомобил спокойно и уверено.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Свържете се с нас
              </Link>
              <Link
                to="/cars"
                className="px-8 py-3 border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition"
              >
                Вижте предложения
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Как работим</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Какво предлагаме</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Пакети</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-8 shadow-lg transition hover:shadow-xl ${
                  p.highlight ? "bg-gray-900 text-white" : "bg-white"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className={`mb-6 ${p.highlight ? "text-gray-200" : "text-gray-600"}`}>
                  {p.price}
                </p>

                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`${p.highlight ? "text-blue-400" : "text-blue-600"}`}>✔</span>
                      <span className={`${p.highlight ? "text-gray-200" : "text-gray-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(p.key);
                    setPlanModalOpen(true);
                  }}
                  className={`mt-8 inline-block w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
                    p.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  Запитване
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Често задавани въпроси</h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <summary className="cursor-pointer font-semibold text-lg">{f.q}</summary>
              <p className="text-gray-600 mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Готови ли сте да намерим вашия автомобил?</h2>
          <p className="text-gray-200 mb-8">
            Кажете ни какво търсите и ние ще се погрижим за останалото.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Свържете се с нас
          </Link>
        </div>
      </section>

      <PlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        selectedKey={selectedPlan}
        currentKey={currentPlan}
        loading={planSaving}
        onConfirm={buyPlan}
      />
    </div>
  );
}
