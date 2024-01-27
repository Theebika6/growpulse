import React from 'react';
import './Help.css';

const Help = ({ sidebarExpanded }) => {

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className="help">
                
            </div>
        </div>
    );
};

export default Help;
