import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ForgotPasswordRequest {
  email: string;
}

function generateResetToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

function getPasswordResetEmailTemplate(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); min-height: 100vh;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%); padding: 40px 40px 60px; text-align: center;">
              <div style="width: 80px; height: 80px; background: white; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <span style="font-size: 40px;">🔑</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Password Reset</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0; font-size: 16px;">Let's get you back into your account</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 50px 40px 40px; text-align: center;">
              <p style="color: #374151; font-size: 18px; margin: 0 0 8px; font-weight: 600;">Forgot your password? No worries! 🎯</p>
              <p style="color: #6b7280; font-size: 16px; margin: 0 0 32px; line-height: 1.6;">
                We received a request to reset your password.<br>
                Click the button below to create a new one.
              </p>
              
              <!-- Reset Button -->
              <div style="margin: 0 auto 32px;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%); color: white; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-size: 18px; font-weight: 700; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4); transition: transform 0.2s;">
                  Reset My Password
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 24px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              
              <div style="background: #f3f4f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; word-break: break-all;">
                <a href="${resetLink}" style="color: #7c3aed; font-size: 13px; text-decoration: none;">${resetLink}</a>
              </div>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  ⏰ This link expires in <strong>1 hour</strong>
                </p>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin: 0; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email.<br>
                Your password will remain unchanged.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #9ca3af; font-size: 13px; margin: 0 0 16px;">
                      Made with 💜 by the Mathify Team
                    </p>
                    <p style="color: #d1d5db; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Mathify. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ForgotPasswordRequest = await req.json();

    console.log("Processing password reset request for:", email);

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Please enter your email address." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const mailersendApiKey = Deno.env.get("MAILERSEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: existingUsers, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    if (authCheckError) {
      console.error("Error checking existing users:", authCheckError);
      // Don't reveal that we had an error - security best practice
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, you'll receive a password reset link shortly." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const user = existingUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log("No user found with email:", email);
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, you'll receive a password reset link shortly." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate password reset link using Supabase Auth
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${req.headers.get('origin') || 'https://mathify.org'}/auth?mode=reset-password`,
      },
    });

    if (resetError) {
      console.error("Error generating reset link:", resetError);
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists with this email, you'll receive a password reset link shortly." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resetLink = resetData.properties?.action_link;
    
    if (!resetLink) {
      console.error("No reset link generated");
      return new Response(
        JSON.stringify({ error: "We couldn't generate a reset link. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send password reset email via MailerSend
    const emailResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mailersendApiKey}`,
      },
      body: JSON.stringify({
        from: {
          email: "support@mathify.org",
          name: "Mathify"
        },
        to: [{ email: email }],
        subject: "🔑 Reset Your Mathify Password",
        html: getPasswordResetEmailTemplate(resetLink),
        text: `Reset your Mathify password by clicking this link: ${resetLink}. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("MailerSend error:", errorText);
      return new Response(
        JSON.stringify({ error: "We couldn't send the reset email. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Password reset email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "If an account exists with this email, you'll receive a password reset link shortly." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in forgot-password function:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again in a moment." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
