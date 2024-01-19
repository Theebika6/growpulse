import React from 'react';
import './systemAlerts.css';

const systemAlerts = ({ sidebarExpanded }) => {
    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>

        </div>
    );
};

export default systemAlerts;
