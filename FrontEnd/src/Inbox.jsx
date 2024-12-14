import React, { useEffect, useState } from 'react';

const Inbox = ({ setView, setSelectedEmail }) => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('date');
    const [readEmails, setReadEmails] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const emailsPerPage = 10;

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/emails');
                const data = await response.json();
                setEmails(data.emails || data);
                setError(null);
            } catch (err) {
                console.error('Error fetching emails:', err);
                setError('Failed to fetch emails');
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
        const interval = setInterval(fetchEmails, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredEmails = emails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.to.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedEmails = [...filteredEmails].sort((a, b) => {
        if (sortOption === 'date') {
            return new Date(b.sentAt) - new Date(a.sentAt);
        } else if (sortOption === 'sender') {
            return a.from.localeCompare(b.from);
        } else {
            return a.subject.localeCompare(b.subject);
        }
    });

    const paginatedEmails = sortedEmails.slice((currentPage - 1) * emailsPerPage, currentPage * emailsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFF4B7]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
            </div>
        );
    }

    const toggleReadStatus = (emailId) => {
        setReadEmails((prev) => ({ ...prev, [emailId]: !prev[emailId] }));
    };

    const deleteEmail = async (emailId) => {
        try {
            await fetch(`http://localhost:5000/api/emails/${emailId}`, {
                method: 'DELETE'
            });
            setEmails(emails.filter(email => email._id !== emailId));
        } catch (err) {
            console.error('Failed to delete email:', err);
        }
    };

    return (
        <div className="p-4 bg-[#121212]"> {/* Rich black background */}
            <div className="p-4 bg-[#1e1e1e] cursor-pointer" onClick={() => setView('compose')}>
                <span className="text-white">&#8592;</span> {/* Back arrow */}
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Inbox</h2>
            <input 
                type="text" 
                placeholder="Search emails..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="mb-4 p-2 border border-gray-600 rounded bg-[#1e1e1e] text-white"
            />
            <select onChange={(e) => setSortOption(e.target.value)} value={sortOption} className="mb-4 p-2 border border-gray-600 rounded bg-[#1e1e1e] text-white">
                <option value="date">Sort by Date</option>
                <option value="sender">Sort by Sender</option>
                <option value="subject">Sort by Subject</option>
            </select>

            {paginatedEmails.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No emails yet.</p>
            ) : (
                <div className="space-y-4">
                    {paginatedEmails.map((email) => (
                        <div 
                            key={email._id} 
                            className={`bg-[#1e1e1e] p-4 rounded-lg border border-[#444] hover:border-[#FFF4B7] transition-colors duration-200 ${readEmails[email._id] ? 'font-normal text-gray-400' : 'font-bold text-white'}`}
                            onClick={() => {
                                toggleReadStatus(email._id);
                                setSelectedEmail(email);
                                setView('draft');
                            }}
                        >
                            <h3 className="text-white text-lg mb-2">
                                {email.subject || 'No Subject'}
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                                <p>From: {email.from || 'Unknown'}</p>
                                <p>To: {email.to || 'Unknown'}</p>
                                <p>Sent: {email.sentAt ? new Date(email.sentAt).toLocaleString() : 'Unknown'}</p>
                            </div>
                            <p className="text-gray-400 mt-2 whitespace-pre-wrap">
                                {email.body || 'No Body'}
                            </p>
                            <button onClick={() => deleteEmail(email._id)} className="text-red-500 hover:text-red-700 mt-2">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => setCurrentPage(currentPage + 1)} className="mt-4 p-2 bg-[#333] text-white rounded">
                Load More
            </button>
        </div>
    );
};

export default Inbox;
