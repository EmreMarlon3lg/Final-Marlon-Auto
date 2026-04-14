import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sooslibexswaxxhkpfsi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb3NsaWJleHN3YXh4aGtwZnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0Njg3NTcsImV4cCI6MjA4NDA0NDc1N30.gOSsNa_ZccQSuAsqV1C97Go1kQOhmPstOeBX56I_Wr8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);