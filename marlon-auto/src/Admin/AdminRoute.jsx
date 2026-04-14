import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, ok: false, reason: "" });

  useEffect(() => {
    let alive = true;

    async function boot() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user ?? null;

        if (!user) {
          if (!alive) return;
          setState({ loading: false, ok: false, reason: "no_session" });
          return;
        }

        const { data: prof, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.log("AdminRoute profile error:", error);
          if (!alive) return;
          setState({ loading: false, ok: false, reason: "profile_error" });
          return;
        }

        const isAdmin = (prof?.role ?? "user") === "admin";
        if (!alive) return;
        setState({ loading: false, ok: isAdmin, reason: isAdmin ? "" : "not_admin" });
      } catch (e) {
        console.log("AdminRoute crash:", e);
        if (!alive) return;
        setState({ loading: false, ok: false, reason: "crash" });
      }
    }

    boot();
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  // ако не е логнат -> login (и запазваме откъде идва)
  if (!state.ok && state.reason === "no_session") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // логнат, но не е admin -> home
  if (!state.ok) {
    return <Navigate to="/" replace />;
  }

  return children;
}