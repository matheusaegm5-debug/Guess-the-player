import { createClient } from "@supabase/supabase-js";

// Publishable ("anon") key - safe to ship in client code. Access to data is
// controlled by Row Level Security policies on the Supabase project, not by
// keeping this key secret.
const SUPABASE_URL = "https://ywxwfwycvzqtbkrxfvpd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_loyXpogtCHP1GyC85WcgBQ_ahWtghfP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
