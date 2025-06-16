
import React from "react";
import { Mail, HelpCircle, Sparkles, BookOpen, Users, Heart } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      id: "what-is-mathify",
      question: "What is Mathify?",
      answer: "Mathify is a completely free, open-source learning platform that makes mathematics engaging and accessible for everyone. We offer interactive games specifically designed for primary mathematics education, while also curating and aggregating the best educational videos and resources from across the web for secondary mathematics. Additionally, we create our own comprehensive learning materials to support students at every level of their mathematical journey.",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: "is-free",
      question: "Is Mathify really free to use?",
      answer: "Yes! Mathify is 100% free and will always remain so. We believe everyone should have equal access to quality educational tools without any paywalls or hidden costs. Our mission is to democratize mathematics education for all.",
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: "age-groups",
      question: "What age groups is Mathify suitable for?",
      answer: "Mathify offers comprehensive resources for all educational levels. Our interactive games are specifically designed for primary school children (ages 5-11), while our curated video content and learning materials support secondary students (ages 11-18) through their entire mathematical journey.",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "how-helps",
      question: "How does Mathify help students learn?",
      answer: "Our multi-faceted approach combines game-based learning for primary mathematics with carefully curated video resources and original learning materials for advanced topics. This blend of interactive engagement and comprehensive content delivery enhances retention and makes complex mathematical concepts more accessible and enjoyable.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "teachers",
      question: "Can teachers use Mathify in their classrooms?",
      answer: "Absolutely! Mathify is designed with classroom integration in mind. Teachers can use our interactive games as engaging supplementary tools for primary mathematics, while leveraging our curated video resources and learning materials to support secondary mathematics instruction and homework assignments.",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "support",
      question: "How can I report a bug or suggest a feature?",
      answer: "We welcome your feedback and actively use it to improve Mathify! You can reach out to us through our Contact form or email us directly. We're constantly working to enhance the platform based on user input and educational best practices.",
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Support Center</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-6 leading-tight">
            Frequently Asked
            <br />
            <span className="text-4xl md:text-6xl">Questions</span>
          </h1>
          
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about Mathify and how we're revolutionizing mathematics education
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="border-none"
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/70 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl border-0">
                  <AccordionTrigger className="px-6 py-6 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {faq.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6">
                      <div className="pl-16">
                        <p className="text-slate-600 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                        {faq.id === "support" && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-purple-600" />
                              <a 
                                href="mailto:support@mathify.org" 
                                className="text-purple-600 hover:text-purple-800 transition-colors font-semibold"
                              >
                                support@mathify.org
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-purple-100 mb-6 text-lg">
                We're here to help! Reach out to our friendly support team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="h-5 w-5" />
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
