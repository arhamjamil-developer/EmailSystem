import React, { useState } from 'react';
import { FaArrowAltCircleLeft, FaEdit, FaTrash } from "react-icons/fa";

const Draft = ({ selectedEmail, setView, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSubject, setEditedSubject] = useState(selectedEmail ? selectedEmail.subject : '');
    const [editedBody, setEditedBody] = useState(selectedEmail ? selectedEmail.body : '');

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Here you would typically save the edited draft to your backend
        console.log('Draft saved:', { subject: editedSubject, body: editedBody });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(selectedEmail._id); // Assuming selectedEmail has an _id property
        }
        setView('inbox'); // Redirect to inbox after deletion
    };

    return (
        <div className="p-4 bg-[#1d1f21] rounded-lg shadow-md">
            {/* Back Arrow Icon */}
            <div className="p-4 cursor-pointer" onClick={() => setView('inbox')}>
                <FaArrowAltCircleLeft size={30} className="text-[#FFF4B7]" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-[#FFF4B7]">Draft</h2>
            {selectedEmail ? (
                <div className="bg-[#2a2a2a] p-4 rounded-lg shadow">
                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={editedSubject}
                                onChange={(e) => setEditedSubject(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded mb-2 bg-[#333] text-white"
                                placeholder="Subject"
                            />
                            <textarea
                                value={editedBody}
                                onChange={(e) => setEditedBody(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded mb-2 bg-[#333] text-white"
                                rows="6"
                                placeholder="Email body"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-[#555] text-[#FFF4B7] px-4 py-2 rounded hover:bg-[#777]"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-600 text-gray-200 px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-[#FFF4B7]">{selectedEmail.subject}</h3>
                            <p className="text-gray-300 mb-4">{selectedEmail.body}</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                                >
                                    <FaTrash className="mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-400">No email selected for drafting.</p>
            )}
        </div>
    );
};

export default Draft;
