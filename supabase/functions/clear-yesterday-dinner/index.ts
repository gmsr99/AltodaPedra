import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Days of week indexed by JavaScript Date.getDay() (0 = Sunday)
const DAYS_JS_INDEX = [
    "Domingo",  // 0
    "Segunda",  // 1
    "Terça",    // 2
    "Quarta",   // 3
    "Quinta",   // 4
    "Sexta",    // 5
    "Sábado",   // 6
];

serve(async (req) => {
    try {
        // Create Supabase client with service role key
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get yesterday's day of week
        const today = new Date().getDay();
        const yesterday = (today - 1 + 7) % 7;
        const yesterdayName = DAYS_JS_INDEX[yesterday];

        console.log(`Clearing yesterday's dinner: ${yesterdayName}`);

        // Clear yesterday's dinner
        const { error } = await supabaseClient
            .from('weekly_dinners')
            .update({ user_id: null, dish: '' })
            .eq('day', yesterdayName);

        if (error) {
            console.error('Error clearing dinner:', error);
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`Successfully cleared dinner for ${yesterdayName}`);

        return new Response(
            JSON.stringify({ success: true, cleared: yesterdayName }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
})
