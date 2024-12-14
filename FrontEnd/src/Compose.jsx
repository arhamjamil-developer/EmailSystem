// src/components/Compose.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaRegPaperPlane } from 'react-icons/fa'; // Added paper plane icon
import { MdDrafts } from 'react-icons/md'; // Added drafts icon
import "./index.css";

const Compose = ({ setView }) => {
    const [to, setTo] = useState('');
    const [from, setFrom] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailData = { to, from, subject, body };
        await axios.post('http://localhost:5000/api/emails', emailData);
        setTo('');
        setFrom('');
        setSubject('');
        setBody('');
    };

    return (
        <div className="flex p-6 bg-[#1A1A1D] min-h-screen text-gray-200 rounded-lg shadow-lg">
            {/* Sidebar with navigation buttons */}
            <div className="flex flex-col items-start border-[#3C3D37]">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-[#A64D79] bg-[#FFF4B7] p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                    <FaEnvelope className="mr-3 text-4xl" />
                    <span className="underline decoration-[#3B1C32] decoration-2 hover:decoration-[#000B58]">Compose Email</span>
                </h2>

                {/* Inbox and Draft Buttons with Navigation */}
                <button
                    onClick={() => setView('inbox')}
                    className="flex items-center bg-[#3C3D37] text-gray-300 p-2 mb-4 rounded-md hover:bg-[#697565] transition duration-200 w-full shadow"
                >
                    <FaEnvelope className="mr-2" /> Inbox
                </button>
                <button
                    onClick={() => setView('draft')}
                    className="flex items-center bg-[#3C3D37] text-gray-300 p-2 mb-4 rounded-md hover:bg-[#697565] transition duration-200 w-full shadow"
                >
                    <MdDrafts className="mr-2" /> Draft
                </button>
                
                {/* Divider Line */}
                <div className="border-t border-gray-600 my-4 w-full"></div>
                
                {/* Send Button */}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex items-center bg-[#697565] text-white p-2 rounded-md hover:bg-[#3C3D37] transition duration-200 w-full shadow-lg"
                >
                    <FaRegPaperPlane className="mr-2" /> Send
                </button>
            </div>

            {/* Vertical Line */}
            <div className="hidden md:block border-l border-[#3C3D37] mx-6"></div>

            {/* Email Form */}
            <div className="flex-1">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="To"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border border-[#3C3D37] bg-[#1A1A1D] text-gray-300 p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#A64D79]"
                    />
                    <input
                        type="text"
                        placeholder="From"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border border-[#3C3D37] bg-[#1A1A1D] text-gray-300 p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#A64D79]"
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border border-[#3C3D37] bg-[#1A1A1D] text-gray-300 p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#A64D79]"
                    />
                    <textarea
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="border border-[#3C3D37] bg-[#1A1A1D] text-gray-300 p-3 mb-4 w-full h-40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A64D79]"
                    />
                </form>
            </div>
        </div>
    );
};

export default Compose;
