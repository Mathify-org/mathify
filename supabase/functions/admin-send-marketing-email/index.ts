import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "support@mathify.org";
const PHYSICAL_ADDRESS = "Mathify Education Ltd, London, United Kingdom";
const UNSUBSCRIBE_URL = "https://mathify.org/unsubscribe";
const MATHIFY_LOGO_URL = "https://mathify.org/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png";

interface EmailRequest {
  recipients: { email: string; name?: string }[];
  subject: string;
  templateId: string;
  customContent?: {
    heading?: string;
    body?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

function formatBodyText(text: string): string {
  // Convert newlines to <br> tags for proper HTML rendering
  // Also handle double newlines as paragraph breaks
  return text
    .split(/\n\n+/)  // Split on double+ newlines (paragraphs)
    .map(paragraph => paragraph.trim().replace(/\n/g, '<br>'))  // Convert single newlines to <br>
    .filter(p => p.length > 0)
    .join('</p><p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">');
}

function getEmailTemplate(templateId: string, recipientEmail: string, customContent?: EmailRequest['customContent']): string {
  const unsubscribeLink = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(recipientEmail)}`;
  const formattedBody = customContent?.body ? formatBodyText(customContent.body) : null;
  
  const baseStyles = `
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); min-height: 100vh; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%); padding: 40px 40px 60px; text-align: center; }
    .logo { width: 80px; height: 80px; background: white; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); padding: 12px; }
    .logo img { width: 100%; height: 100%; object-fit: contain; }
    .header p { color: rgba(255,255,255,0.9); margin: 12px 0 0; font-size: 16px; }
    .body { padding: 50px 40px 40px; text-align: center; }
    .body h2 { color: #1f2937; font-size: 24px; margin: 0 0 16px; }
    .body p { color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3); }
    .footer { background: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { color: #9ca3af; font-size: 13px; margin: 0 0 12px; }
    .footer small { color: #d1d5db; font-size: 12px; }
    .footer-links { margin: 16px 0; }
    .footer-links a { color: #7c3aed; text-decoration: none; font-size: 13px; margin: 0 8px; }
    .footer-links a:hover { text-decoration: underline; }
    .address { color: #9ca3af; font-size: 11px; margin-top: 16px; line-height: 1.5; }
    .unsubscribe { color: #9ca3af; font-size: 11px; margin-top: 12px; }
    .unsubscribe a { color: #7c3aed; text-decoration: underline; }
    .feature-box { background: linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%); border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e0e7ff; }
    .emoji { font-size: 48px; margin-bottom: 16px; }
  `;

  const footerHtml = `
  <div class="footer">
    <p>Made with 💜 by the Mathify Team</p>
    <div class="footer-links">
      <a href="https://mathify.org">Visit Website</a>
      <a href="https://mathify.org/privacy-policy">Privacy Policy</a>
      <a href="https://mathify.org/terms">Terms of Service</a>
    </div>
    <div class="address">
      ${PHYSICAL_ADDRESS}
    </div>
    <div class="unsubscribe">
      You received this email because you signed up for Mathify.<br>
      <a href="${unsubscribeLink}">Unsubscribe</a> from future emails.
    </div>
    <small>© ${new Date().getFullYear()} Mathify. All rights reserved.</small>
  </div>`;

  const templates: Record<string, string> = {
    welcome: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head>
<body>
<table role="presentation" style="width: 100%; padding: 40px 20px;">
<tr><td align="center">
<div class="container">
  <div class="header">
    <div class="logo"><img src="${MATHIFY_LOGO_URL}" alt="Mathify Logo" /></div>
    <h1>Welcome to Mathify!</h1>
    <p>Your mathematical adventure begins here</p>
  </div>
  <div class="body">
    <div class="emoji">🎉</div>
    <h2>${customContent?.heading || "We're thrilled to have you!"}</h2>
    <p>${formattedBody || "Get ready to explore exciting math games, challenges, and learning experiences designed just for you. Whether you're a beginner or a math whiz, there's something for everyone!"}</p>
    <div class="feature-box">
      <p style="margin: 0; color: #7c3aed; font-weight: 600;">🎮 Fun Games • 📊 Track Progress • 🏆 Earn Achievements</p>
    </div>
    <a href="${customContent?.ctaUrl || 'https://mathify.org'}" class="cta-button">${customContent?.ctaText || "Start Learning Now"}</a>
  </div>
  ${footerHtml}
</div>
</td></tr></table>
</body></html>`,

    newsletter: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head>
<body>
<table role="presentation" style="width: 100%; padding: 40px 20px;">
<tr><td align="center">
<div class="container">
  <div class="header">
    <div class="logo"><img src="${MATHIFY_LOGO_URL}" alt="Mathify Logo" /></div>
    <h1>Mathify Newsletter</h1>
    <p>Your weekly dose of mathematical inspiration</p>
  </div>
  <div class="body">
    <div class="emoji">✨</div>
    <h2>${customContent?.heading || "What's New This Week"}</h2>
    <p>${formattedBody || "We've been busy creating new games, challenges, and learning experiences. Check out what's new and continue your mathematical journey!"}</p>
    <div class="feature-box">
      <p style="margin: 0; color: #7c3aed; font-weight: 600;">🆕 New Games • 🎯 Fresh Challenges • 💡 Learning Tips</p>
    </div>
    <a href="${customContent?.ctaUrl || 'https://mathify.org'}" class="cta-button">${customContent?.ctaText || "Explore Now"}</a>
  </div>
  ${footerHtml}
</div>
</td></tr></table>
</body></html>`,

    announcement: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head>
<body>
<table role="presentation" style="width: 100%; padding: 40px 20px;">
<tr><td align="center">
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);">
    <div class="logo"><img src="${MATHIFY_LOGO_URL}" alt="Mathify Logo" /></div>
    <h1>Exciting Announcement!</h1>
    <p>Big news from Mathify</p>
  </div>
  <div class="body">
    <div class="emoji">🚀</div>
    <h2>${customContent?.heading || "Something Amazing is Here"}</h2>
    <p>${formattedBody || "We have some exciting news to share with you! Stay tuned for updates and new features that will make your learning experience even better."}</p>
    <div class="feature-box" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-color: #6ee7b7;">
      <p style="margin: 0; color: #059669; font-weight: 600;">🌟 Major Update • 🎁 Special Surprise • 📈 Better Experience</p>
    </div>
    <a href="${customContent?.ctaUrl || 'https://mathify.org'}" class="cta-button" style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);">${customContent?.ctaText || "Learn More"}</a>
  </div>
  ${footerHtml}
</div>
</td></tr></table>
</body></html>`,

    reengagement: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head>
<body>
<table role="presentation" style="width: 100%; padding: 40px 20px;">
<tr><td align="center">
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%);">
    <div class="logo"><img src="${MATHIFY_LOGO_URL}" alt="Mathify Logo" /></div>
    <h1>We Miss You!</h1>
    <p>Come back and continue your journey</p>
  </div>
  <div class="body">
    <div class="emoji">🎯</div>
    <h2>${customContent?.heading || "Your Math Adventure Awaits"}</h2>
    <p>${formattedBody || "It's been a while since we've seen you! Your progress is waiting, and there are new challenges to conquer. Come back and show us what you've got!"}</p>
    <div class="feature-box" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-color: #fcd34d;">
      <p style="margin: 0; color: #f59e0b; font-weight: 600;">📊 Your Progress Saved • 🎮 New Games Added • 🏆 Achievements Waiting</p>
    </div>
    <a href="${customContent?.ctaUrl || 'https://mathify.org'}" class="cta-button" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%); color: #1f2937;">${customContent?.ctaText || "Jump Back In"}</a>
  </div>
  ${footerHtml}
</div>
</td></tr></table>
</body></html>`,

    custom: `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${baseStyles}</style></head>
<body>
<table role="presentation" style="width: 100%; padding: 40px 20px;">
<tr><td align="center">
<div class="container">
  <div class="header">
    <div class="logo"><img src="${MATHIFY_LOGO_URL}" alt="Mathify Logo" /></div>
    <h1>Mathify</h1>
    <p>A message from our team</p>
  </div>
  <div class="body">
    <h2>${customContent?.heading || "Hello from Mathify"}</h2>
    <p>${formattedBody || "We have something important to share with you."}</p>
    ${customContent?.ctaUrl ? `<a href="${customContent.ctaUrl}" class="cta-button">${customContent?.ctaText || "Learn More"}</a>` : ''}
  </div>
  ${footerHtml}
</div>
</td></tr></table>
</body></html>`
  };

  return templates[templateId] || templates.custom;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const brevoApiKey = Deno.env.get("BREVO_API_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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

    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Access denied. Admin privileges required." }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { recipients, subject, templateId, customContent }: EmailRequest = await req.json();

    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients specified" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subject || !templateId) {
      return new Response(
        JSON.stringify({ error: "Subject and template are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send emails via Brevo (in batches if needed)
    const batchSize = 50;
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      for (const recipient of batch) {
        try {
          // Generate personalized HTML with unsubscribe link for each recipient
          const htmlContent = getEmailTemplate(templateId, recipient.email, customContent);
          const unsubscribeLink = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(recipient.email)}`;
          
          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": brevoApiKey,
            },
            body: JSON.stringify({
              sender: {
                email: "support@mathify.org",
                name: "Mathify"
              },
              to: [{ email: recipient.email, name: recipient.name || undefined }],
              subject: subject,
              htmlContent: htmlContent,
              headers: {
                "List-Unsubscribe": `<${unsubscribeLink}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
              },
              replyTo: {
                email: "support@mathify.org",
                name: "Mathify Support"
              }
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
            const errorText = await response.text();
            console.error(`Failed to send to ${recipient.email}:`, errorText);
            errors.push(`${recipient.email}: ${errorText}`);
          }
        } catch (err: any) {
          failCount++;
          console.error(`Error sending to ${recipient.email}:`, err.message);
          errors.push(`${recipient.email}: ${err.message}`);
        }
      }
    }

    console.log(`Admin ${user.email} sent marketing emails: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        failed: failCount,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in admin-send-marketing-email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send emails" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
