
import React from "react";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Mathify
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">What is Mathify?</h3>
            <p className="text-slate-600">
              Mathify is a completely free, open-source learning environment designed to make mathematics fun and engaging through interactive games for all age groups.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Is Mathify really free to use?</h3>
            <p className="text-slate-600">
              Yes! Mathify is 100% free and will always remain so. We believe everyone should have equal access to quality educational tools without any paywalls.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">What age groups is Mathify suitable for?</h3>
            <p className="text-slate-600">
              Mathify offers games and activities for all age groups, from elementary school children (ages 5-10) to high school students (ages 14-18), with content tailored to each developmental stage.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">How does Mathify help students learn?</h3>
            <p className="text-slate-600">
              Our approach combines game-based learning with educational principles to create engaging experiences that enhance retention and make math concepts more accessible and enjoyable.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Can teachers use Mathify in their classrooms?</h3>
            <p className="text-slate-600">
              Absolutely! Mathify is designed with classroom integration in mind. Teachers can use our games as supplementary learning tools to reinforce concepts taught in class.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-2">How can I report a bug or suggest a feature?</h3>
            <p className="text-slate-600">
              We welcome your feedback! You can report bugs or suggest features through our Contact form. We're constantly working to improve Mathify based on user input.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
