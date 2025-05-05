
import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Last updated: May 5, 2025
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
          <div className="prose prose-slate mx-auto">
            <p>
              Welcome to Mathify! These Terms of Service govern your use of our website and services. By accessing or using Mathify, you agree to be bound by these Terms.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Use of Our Services</h3>
            <p>
              Mathify provides educational games and resources free of charge. You agree to use our services only for their intended educational purposes and in compliance with all applicable laws and regulations.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">User Accounts</h3>
            <p>
              While most of our content is accessible without registration, some features may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Intellectual Property</h3>
            <p>
              All content on Mathify, including games, graphics, text, and code, is protected by intellectual property rights and owned by Mathify or our licensors. While we operate as an open-source platform, specific terms of use and attribution requirements apply.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Prohibited Activities</h3>
            <p>
              When using our services, you agree not to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Use our services for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any portion of our platform</li>
              <li>Interfere with or disrupt the integrity of our services</li>
              <li>Copy or redistribute our content without permission</li>
            </ul>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Disclaimer of Warranties</h3>
            <p>
              Mathify provides its services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of our services.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Mathify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Changes to These Terms</h3>
            <p>
              We may update our Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page.
            </p>
            
            <h3 className="text-xl font-bold text-purple-700 mt-6 mb-2">Contact Us</h3>
            <p>
              If you have any questions about these Terms, please <Link to="/contact" className="text-purple-600 hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
