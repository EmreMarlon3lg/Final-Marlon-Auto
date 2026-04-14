import { supabase } from "../../Supabase/supabaseClient";

export async function auditLog({ action, entity_type, entity_id, old_data, new_data }) {
  try {
    await supabase.from("audit_logs").insert([
      {
        action,
        entity_type,
        entity_id: entity_id ?? null,
        old_data: old_data ?? null,
        new_data: new_data ?? null,
      },
    ]);
  } catch (e) {
    // не блокираме UI ако логът падне
    console.log("auditLog failed:", e);
  }
}
