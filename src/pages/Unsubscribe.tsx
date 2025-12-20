import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MailX, CheckCircle2, AlertCircle, Loader2, Home } from "lucide-react";
import { Helmet } from "react-helmet";

type UnsubscribeStatus = "pending" | "confirming" | "success" | "already" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<UnsubscribeStatus>("pending");
  const [message, setMessage] = useState("");
  const [emailType, setEmailType] = useState<"newsletter" | "marketing">("newsletter");

  const email = searchParams.get("email");
  const type = (searchParams.get("type") as "newsletter" | "marketing") || "newsletter";

  useEffect(() => {
    setEmailType(type);
  }, [type]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Invalid unsubscribe link. No email address provided.");
      return;
    }

    setStatus("confirming");

    try {
      const { data, error } = await supabase.functions.invoke("unsubscribe-email", {
        body: { email, type: emailType },
      });

      if (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
        return;
      }

      if (data.alreadyUnsubscribed) {
        setStatus("already");
        setMessage(data.message);
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Unsubscribe error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  const getTypeLabel = () => {
    return emailType === "newsletter" ? "newsletter" : "marketing";
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe - Mathify</title>
        <meta name="description" content="Unsubscribe from Mathify emails" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
        <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
          {/* Header gradient */}
          <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
          
          <CardContent className="p-8">
            {status === "pending" && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                  <MailX className="w-10 h-10 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    Unsubscribe from {getTypeLabel()} emails?
                  </h1>
                  <p className="text-muted-foreground">
                    {email ? (
                      <>
                        We'll remove <span className="font-medium text-foreground">{email}</span> from our {getTypeLabel()} list.
                      </>
                    ) : (
                      "Invalid unsubscribe link."
                    )}
                  </p>
                  {emailType === "marketing" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Note: You'll still receive important account-related emails.
                    </p>
                  )}
                </div>

                {email && (
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleUnsubscribe}
                      className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Yes, unsubscribe me
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        No, keep me subscribed
                      </Button>
                    </Link>
                  </div>
                )}

                {!email && (
                  <Link to="/">
                    <Button className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {status === "confirming" && (
              <div className="text-center space-y-6 py-8">
                <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Processing...</h2>
                  <p className="text-muted-foreground">Please wait while we update your preferences.</p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">You're unsubscribed</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Changed your mind? You can always resubscribe from your profile settings.
                  </p>
                  <Link to="/">
                    <Button className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Return to Mathify
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "already" && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Already unsubscribed</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>

                <Link to="/">
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Return to Mathify
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={() => setStatus("pending")} variant="outline" className="w-full">
                    Try again
                  </Button>
                  <Link to="/contact">
                    <Button className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Unsubscribe;
