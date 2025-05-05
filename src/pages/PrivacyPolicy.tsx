
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="text-center mb-12 pt-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4 pb-1">
            Privacy Policy
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Last updated: May 5, 2025
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
          <div className="prose prose-slate mx-auto">
            <p>
              At Mathify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Information We Collect</h3>
            <p>
              We collect minimal personal information, limited to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Email address (only if you subscribe to our newsletter)</li>
              <li>Anonymous usage data to improve our services</li>
              <li>Optional feedback you provide</li>
            </ul>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">How We Use Your Information</h3>
            <p>
              The information we collect is used solely to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Send our newsletter (if subscribed)</li>
              <li>Improve our platform based on usage patterns</li>
              <li>Respond to your inquiries</li>
            </ul>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Cookies and Tracking</h3>
            <p>
              We use essential cookies to ensure the proper functioning of our website. You can control cookie settings through your browser preferences.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Data Security</h3>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Children's Privacy</h3>
            <p>
              Mathify is designed for users of all ages. We do not knowingly collect personally identifiable information from children under 13 without parental consent.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-purple-600 hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
