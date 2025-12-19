import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOtpRequest {
  email: string;
  otp_code: string;
  password: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp_code, password }: VerifyOtpRequest = await req.json();

    console.log("Processing OTP verification for:", email);

    if (!email || !otp_code || !password) {
      return new Response(
        JSON.stringify({ error: "Email, OTP code, and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the pending signup
    const { data: pendingSignup, error: fetchError } = await supabase
      .from("pending_signups")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("otp_code", otp_code)
      .single();

    if (fetchError || !pendingSignup) {
      console.log("Invalid OTP or email:", fetchError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid verification code. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if OTP has expired
    if (new Date(pendingSignup.expires_at) < new Date()) {
      await supabase.from("pending_signups").delete().eq("id", pendingSignup.id);
      
      return new Response(
        JSON.stringify({ error: "Verification code has expired. Please sign up again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the password matches the stored hash
    const providedHash = await hashPassword(password);
    if (providedHash !== pendingSignup.password_hash) {
      return new Response(
        JSON.stringify({ error: "Password does not match. Please enter the password you used during signup." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create the user in Supabase Auth with their actual password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: pendingSignup.email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: pendingSignup.first_name,
        display_name: pendingSignup.display_name,
      },
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to create account. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("User created successfully:", authData.user.id);

    // Generate username from email
    const { data: usernameData } = await supabase.rpc('generate_username_from_email', {
      email_address: pendingSignup.email
    });
    const username = usernameData || pendingSignup.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Create/update the profile with username
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      email: pendingSignup.email,
      first_name: pendingSignup.first_name,
      display_name: pendingSignup.display_name,
      username: username,
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    // Delete the pending signup
    await supabase.from("pending_signups").delete().eq("id", pendingSignup.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account created successfully! You can now sign in.",
        user_id: authData.user.id,
        email: pendingSignup.email,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
