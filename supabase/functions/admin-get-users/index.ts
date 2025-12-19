import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "support@mathify.org";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // First, verify the requesting user is the admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create a client with the user's token to get their identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if the user is the admin
    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Access denied. Admin privileges required." }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Now use service role to fetch all users with pagination
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch all users with pagination (listUsers defaults to 50)
    let allAuthUsers: any[] = [];
    let page = 1;
    const perPage = 1000; // Max allowed by Supabase
    let hasMore = true;
    
    while (hasMore) {
      const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers({
        page,
        perPage,
      });
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch users" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      allAuthUsers = [...allAuthUsers, ...authUsers.users];
      
      // Check if there are more users
      if (authUsers.users.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Also fetch profiles for additional data
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("*");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    // Merge auth users with profiles
    const users = allAuthUsers.map(authUser => {
      const profile = profiles?.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        email_confirmed_at: authUser.email_confirmed_at,
        first_name: profile?.first_name || authUser.user_metadata?.first_name || null,
        last_name: profile?.last_name || null,
        display_name: profile?.display_name || null,
      };
    });

    console.log(`Admin ${user.email} fetched ${users.length} users (paginated)`);

    return new Response(
      JSON.stringify({ users }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in admin-get-users:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
