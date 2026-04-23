import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";
import PlanModal, { PLANS } from "../components/PlanModal";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({ full_name: "", phone: "", plan: "basic" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text: string }

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [planSaving, setPlanSaving] = useState(false);

  const initials = useMemo(() => {
    const name = (profile.full_name || "").trim();
    if (!name) return "MA";
    const parts = name.split(/\s+/);
    const a = (parts[0]?.[0] || "M").toUpperCase();
    const b = (parts[1]?.[0] || "A").toUpperCase();
    return a + b;
  }, [profile.full_name]);

  const planTitle = useMemo(() => {
    return PLANS.find((p) => p.key === (profile.plan || "basic"))?.title ?? "Basic";
  }, [profile.plan]);

  useEffect(() => {
    let alive = true;

    async function boot() {
      try {
        setLoading(true);
        setMessage(null);

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) console.log("getSession error:", sessionErr);

        const u = sessionData?.session?.user ?? null;

        if (!u) {
          navigate("/login");
          return;
        }

        if (!alive) return;
        setUser(u);

        const { data: prof, error: profErr } = await supabase
          .from("profiles")
          .select("full_name, phone, plan")
          .eq("id", u.id)
          .maybeSingle();

        if (profErr) {
          console.log("profile select error:", profErr);
          if (alive) setMessage({ type: "error", text: profErr.message || "Грешка при зареждане." });
          if (alive) setLoading(false);
          return;
        }

        if (!prof) {
          const { error: insErr } = await supabase.from("profiles").insert({
            id: u.id,
            email: u.email ?? "",
            full_name: "",
            phone: "",
            plan: "basic",
          });

          if (insErr) {
            console.log("profile insert error:", insErr);
            if (alive) setMessage({ type: "error", text: insErr.message || "Грешка при създаване на профил." });
          } else {
            if (alive) setProfile({ full_name: "", phone: "", plan: "basic" });
          }
        } else {
          if (alive)
            setProfile({
              full_name: prof.full_name ?? "",
              phone: prof.phone ?? "",
              plan: prof.plan ?? "basic",
            });
        }

        if (alive) setLoading(false);
      } catch (e) {
        console.log("Account boot crash:", e);
        if (alive) {
          setMessage({ type: "error", text: "Грешка в страницата Account (виж Console)." });
          setLoading(false);
        }
      }
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate("/login");
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, [navigate]);

  async function onSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      id: user.id,
      email: user.email ?? "",
      full_name: profile.full_name.trim(),
      phone: profile.phone.trim(),
      plan: profile.plan ?? "basic",
    };

    const { error } = await supabase.from("profiles").upsert(payload);

    if (error) {
      console.log("SUPABASE SAVE ERROR:", error);
      setMessage({ type: "error", text: error.message || "Грешка при запис. Опитай пак." });
      setSaving(false);
      return;
    }

    setMessage({ type: "success", text: "Профилът е обновен ✅" });
    setSaving(false);
  }

  async function onLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  async function updatePlan(planKey) {
    if (!user) return;

    setPlanSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ plan: planKey })
      .eq("id", user.id);

    if (error) {
      console.log("PLAN UPDATE ERROR:", error);
      setMessage({ type: "error", text: error.message || "Грешка при обновяване на плана." });
      setPlanSaving(false);
      return;
    }

    setProfile((p) => ({ ...p, plan: planKey }));
    setMessage({ type: "success", text: "Честито! Обнови плана си ✅" });
    setPlanSaving(false);
    setPlanModalOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="h-56 animate-pulse rounded-2xl bg-gray-200 md:col-span-1" />
            <div className="h-56 animate-pulse rounded-2xl bg-gray-200 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Моят акаунт</h1>
            <p className="text-sm text-gray-600">Тези данни са видими само за теб.</p>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Изход
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* left card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-semibold text-gray-900">{user?.email}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                План: {planTitle}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(profile.plan || "basic");
                  setPlanModalOpen(true);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Промени план
              </button>
            </div>
          </div>

          {/* right card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">Профил</h2>

            <form onSubmit={onSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">Име и фамилия</label>
                  <input
                    value={profile.full_name}
                    onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                    placeholder="Напр. Денис Ламбрев"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm font-semibold text-gray-800">Телефон</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="Напр. +359 88 123 4567"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Email</label>
                <input
                  value={user?.email ?? ""}
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-700"
                />
                <p className="mt-2 text-xs text-gray-500">Email-ът се управлява от login-а.</p>
              </div>

              {message?.text && (
                <div
                  className={
                    "rounded-xl px-4 py-3 text-sm " +
                    (message.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800")
                  }
                >
                  {message.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, full_name: "", phone: "" }))}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Изчисти
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Запис..." : "Запази"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        selectedKey={selectedPlan}
        currentKey={profile.plan || "basic"}
        loading={planSaving}
        onConfirm={updatePlan}
      />
    </div>
  );
}
