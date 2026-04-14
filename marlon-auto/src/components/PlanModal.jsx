import { useMemo } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const PLANS = [
  {
    key: "basic",
    title: "Basic",
    priceText: "от 299 лв",
    bullets: [
      "Консултация и насоки",
      "Подбор на предложения",
      "Проверка на документи (когато са налични)",
      "Поддръжка до финален избор",
    ],
  },
  {
    key: "premium",
    title: "Premium",
    priceText: "от 599 лв",
    bullets: [
      "Всичко от Basic",
      "Организация на технически преглед",
      "Преговори и съдействие при сделка",
      "Документи и регистрация",
    ],
  },
  {
    key: "vip",
    title: "VIP",
    priceText: "по договаряне",
    bullets: [
      "Всичко от Premium",
      "Внос и логистика (при нужда)",
      "Приоритетна обработка",
      "Персонален мениджър",
    ],
  },
];

function Card({ plan, active }) {
  return (
    <div
      className={
        "rounded-2xl p-5 ring-1 " +
        (active ? "bg-gray-900 text-white ring-gray-900" : "bg-white text-gray-900 ring-gray-100")
      }
    >
      <div className="text-lg font-bold">{plan.title}</div>
      <div className={"mt-1 text-sm " + (active ? "text-gray-200" : "text-gray-600")}>
        {plan.priceText}
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {plan.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className={active ? "text-blue-300" : "text-blue-600"}>✓</span>
            <span className={active ? "text-gray-100" : "text-gray-700"}>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlanModal({
  open,
  onClose,
  selectedKey = "basic",
  currentKey = "basic",
  onConfirm,
  loading = false,
}) {
  const idx = useMemo(() => PLANS.findIndex((p) => p.key === selectedKey), [selectedKey]);

  const cheaper = idx > 0 ? PLANS[idx - 1] : null;
  const selected = PLANS[idx] || PLANS[0];
  const pricier = idx < PLANS.length - 1 ? PLANS[idx + 1] : null;

  const upgradeText =
    selectedKey === currentKey
      ? "Това е текущият ти план."
      : `Ще смениш плана си на ${selected.title}.`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Избран план: {selected.title}</h3>
            <p className="mt-1 text-sm text-gray-600">
              Сравнение с по-евтин и по-скъп (ако има).
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Затвори
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cheaper ? (
            <Card plan={cheaper} active={false} />
          ) : (
            <div className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">Няма по-евтин план.</div>
          )}

          <Card plan={selected} active />

          {pricier ? (
            <Card plan={pricier} active={false} />
          ) : (
            <div className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">Няма по-скъп план.</div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700">
            <div className="font-semibold">{upgradeText}</div>
            <div className="text-gray-500">
              Текущ: {PLANS.find((p) => p.key === currentKey)?.title ?? "—"}
            </div>
          </div>

          <button
            onClick={() => onConfirm?.(selectedKey)}
            disabled={loading || selectedKey === currentKey}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Обновяване..." : selectedKey === currentKey ? "Вече е активен" : "Закупи"}
          </button>
        </div>
      </div>
    </div>
  );
}
