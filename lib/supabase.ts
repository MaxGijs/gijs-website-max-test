import { createClient } from "@supabase/supabase-js";

// Minimale, herbruikbare Supabase-client voor de frontend.
//
// BELANGRIJK: alleen de publieke/publishable (anon) key hoort hier. Nooit
// de service_role/secret key gebruiken in code die naar de browser gaat —
// die geeft volledige toegang en omzeilt Row Level Security. Deze client
// gebruikt uitsluitend NEXT_PUBLIC_*-variabelen, die sowieso al zichtbaar
// zijn voor de browser; dat is precies wat de publishable key veilig maakt.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase-omgevingsvariabelen ontbreken. Controleer NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (projectroot) en herstart de dev-server."
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
