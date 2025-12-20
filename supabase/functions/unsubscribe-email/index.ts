import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UnsubscribeRequest {
  email: string;
  type: "newsletter" | "marketing";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { email, type }: UnsubscribeRequest = await req.json();

    if (!email || !type) {
      console.error("Missing required fields:", { email, type });
      return new Response(
        JSON.stringify({ error: "Email and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`Processing unsubscribe request: type=${type}, email=${normalizedEmail}`);

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    if (type === "newsletter") {
      // Handle newsletter subscriber unsubscription
      const { data: subscriber, error: fetchError } = await adminClient
        .from("newsletter_subscribers")
        .select("id, is_active")
        .eq("email", normalizedEmail)
        .single();

      if (fetchError || !subscriber) {
        console.log("Subscriber not found:", normalizedEmail);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "If this email was subscribed, it has been unsubscribed.",
            alreadyUnsubscribed: true
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!subscriber.is_active) {
        console.log("Subscriber already unsubscribed:", normalizedEmail);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "This email is already unsubscribed from our newsletter.",
            alreadyUnsubscribed: true
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error: updateError } = await adminClient
        .from("newsletter_subscribers")
        .update({ is_active: false })
        .eq("id", subscriber.id);

      if (updateError) {
        console.error("Error updating subscriber:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to unsubscribe. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Successfully unsubscribed newsletter subscriber:", normalizedEmail);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "You have been successfully unsubscribed from our newsletter.",
          type: "newsletter"
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (type === "marketing") {
      // Handle registered user marketing email unsubscription
      const { data: profile, error: fetchError } = await adminClient
        .from("profiles")
        .select("id, marketing_emails_enabled")
        .eq("email", normalizedEmail)
        .single();

      if (fetchError || !profile) {
        console.log("User profile not found:", normalizedEmail);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "If this email was registered, marketing emails have been disabled.",
            alreadyUnsubscribed: true
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!profile.marketing_emails_enabled) {
        console.log("User already opted out of marketing:", normalizedEmail);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "You are already unsubscribed from marketing emails.",
            alreadyUnsubscribed: true
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error: updateError } = await adminClient
        .from("profiles")
        .update({ marketing_emails_enabled: false })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to unsubscribe. Please try again." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Successfully disabled marketing emails for user:", normalizedEmail);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "You have been successfully unsubscribed from marketing emails. You will still receive important account-related emails.",
          type: "marketing"
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Invalid unsubscribe type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error("Error in unsubscribe-email function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
