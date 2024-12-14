import React, { useState } from 'react';
import Compose from './Compose';
import Draft from './Draft';
import Inbox from './Inbox';

const App = () => {
    const [view, setView] = useState('inbox'); // Start with inbox view
    const [selectedEmail, setSelectedEmail] = useState(null); // State to hold the selected email
    
    const handleDelete = (id) => {
        // Implement email deletion logic here
        console.log(`Email with ID ${id} deleted`);
        // You might want to update the state to remove the deleted email from the inbox
        // For example, you could fetch the updated list of emails after deletion
        setSelectedEmail(null); // Clear the selected email after deletion
        setView('inbox'); // Optionally navigate back to inbox after deletion
    };

    return (
        <div className="container mx-auto">
            {view === 'compose' && <Compose setView={setView} />}
            {view === 'inbox' && <Inbox setView={setView} setSelectedEmail={setSelectedEmail} />}
            {view === 'draft' && (
                <Draft 
                    selectedEmail={selectedEmail} 
                    setView={setView} 
                    onDelete={handleDelete} // Pass the handleDelete function
                />
            )}
        </div>
    );
};

export default App;