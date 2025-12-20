import React, { useState } from 'react';
import { Send, MessageSquare, Plus, Minus, ChevronDown } from 'lucide-react';

const Support = () => {
    const [activeFaqIndex, setActiveFaqIndex] = useState(3); // Start with the last one open to match screenshot

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "To reset your password, please go to the login page and click on the 'Forgot Password' link. You will receive an email with instructions on how to reset it."
        },
        {
            question: "How do I add a new part to the inventory?",
            answer: "You can add a new part to the inventory by navigating to the 'Inventory' page and clicking on the 'Add New Part' button. Fill out the required details in the form that appears."
        },
        {
            question: "What's the difference between an Admin and a User role?",
            answer: "An Admin has full access to manage all aspects of the portal, including user management, inventory, and settings. A User role has limited access, typically restricted to viewing data and performing specific tasks assigned to them."
        },
        {
            question: "How does the AI Stock Forecasting work?",
            answer: "The AI Stock Forecasting feature uses historical data of item dispatch and receiving to predict future inventory needs. It analyzes trends and patterns to suggest reorder points and quantities, helping to prevent stockouts."
        }
    ];

    const toggleFaq = (index) => {
        setActiveFaqIndex(activeFaqIndex === index ? null : index);
    };

    return (
        <div className="p-6 text-slate-300">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <MessageSquare className="text-slate-200" size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Material Management Portal</p>
                    <h1 className="text-2xl font-bold text-white">Support Center</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQs */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1f2533] rounded-xl border border-slate-700/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-700/50">
                            <h2 className="text-lg font-semibold text-white mb-2">Frequently Asked Questions</h2>
                            <p className="text-sm text-slate-400">Find answers to common questions about the portal.</p>
                        </div>

                        <div className="divide-y divide-slate-800">
                            {faqs.map((faq, index) => (
                                <div key={index} className="group">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/20 transition-colors"
                                    >
                                        <span className={`text-sm font-medium transition-colors ${activeFaqIndex === index ? 'text-white' : 'text-slate-200'}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-slate-500 transition-transform duration-200 ${activeFaqIndex === index ? 'rotate-180 text-white' : ''}`}
                                        />
                                    </button>

                                    {/* Accordion Content */}
                                    {activeFaqIndex === index && (
                                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1f2533] p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-lg font-semibold text-white mb-2">Contact Support</h2>
                        <p className="text-sm text-slate-400 mb-6">If you can't find an answer in the FAQ, please fill out the form below.</p>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Your Name</label>
                                <input type="text" placeholder="e.g. Alex Smith" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Your Email</label>
                                <input type="email" placeholder="e.g. alex@example.com" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Subject</label>
                                <div className="relative">
                                    <select className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer transition-colors">
                                        <option>Select a reason for contacting us</option>
                                        <option>Technical Issue</option>
                                        <option>Account Access</option>
                                        <option>Feature Request</option>
                                        <option>Billing Inquiry</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Message</label>
                                <textarea rows="4" placeholder="Please describe your issue or request in detail." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-colors"></textarea>
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-300 text-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors mt-2">
                                <Send size={16} />
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
