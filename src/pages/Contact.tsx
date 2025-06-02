
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your feedback. We'll get back to you soon!",
      });
      
      setIsSubmitting(false);
      // Reset the form
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4 pb-1">
            Contact Us
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto px-4 md:px-0">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Email Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-8 mb-6">
          <div className="text-center">
            <Mail className="h-8 w-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-purple-700 mb-2">Email Us Directly</h3>
            <p className="text-slate-600 mb-4">
              For quick questions or support, you can reach us at:
            </p>
            <a 
              href="mailto:support@mathify.org" 
              className="text-lg font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              support@mathify.org
            </a>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 md:p-8 mb-8 md:mb-16">
          <h3 className="text-lg md:text-xl font-bold text-purple-700 mb-6 text-center">Or Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" placeholder="Your name" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Your email" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="What's this about?" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea 
                id="message" 
                placeholder="Your message..." 
                className="min-h-[120px] md:min-h-[150px]"
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition-opacity"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
