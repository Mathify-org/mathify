import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOtpRequest {
  email: string;
  password: string;
  first_name: string;
  display_name: string;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    const { email, password, first_name, display_name }: SendOtpRequest = await req.json();

    console.log("Processing OTP request for:", email);

    // Validate inputs
    if (!email || !password || !first_name || !display_name) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const mailersendApiKey = Deno.env.get("MAILERSEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already exists in auth.users
    const { data: existingUsers, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    if (authCheckError) {
      console.error("Error checking existing users:", authCheckError);
      return new Response(
        JSON.stringify({ error: "Failed to verify email availability" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userExists = existingUsers.users.some(u => u.email?.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists. Please sign in instead." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate OTP and hash password
    const otpCode = generateOtp();
    const passwordHash = await hashPassword(password);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing pending signups for this email
    await supabase.from("pending_signups").delete().eq("email", email.toLowerCase());

    // Insert new pending signup
    const { error: insertError } = await supabase.from("pending_signups").insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      otp_code: otpCode,
      expires_at: expiresAt.toISOString(),
      first_name,
      display_name,
      verified: false,
    });

    if (insertError) {
      console.error("Error inserting pending signup:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to initiate signup" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send OTP email via MailerSend
    const emailResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mailersendApiKey}`,
      },
      body: JSON.stringify({
        from: {
          email: "noreply@trial-neqvygmzq7j40p7w.mlsender.net",
          name: "Mathify"
        },
        to: [{ email: email }],
        subject: "Your Mathify Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed; text-align: center;">Welcome to Mathify!</h1>
            <p style="font-size: 16px; color: #374151;">Hi ${first_name},</p>
            <p style="font-size: 16px; color: #374151;">Thank you for signing up! Please use the verification code below to complete your registration:</p>
            <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px;">${otpCode}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #6b7280;">If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">© ${new Date().getFullYear()} Mathify. All rights reserved.</p>
          </div>
        `,
        text: `Welcome to Mathify! Your verification code is: ${otpCode}. This code expires in 10 minutes.`,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("MailerSend error:", errorText);
      
      // Clean up the pending signup
      await supabase.from("pending_signups").delete().eq("email", email.toLowerCase());
      
      return new Response(
        JSON.stringify({ error: "Failed to send verification email. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("OTP sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Verification code sent to your email" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
