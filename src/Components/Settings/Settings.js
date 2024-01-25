import React from 'react';
import './Settings.css';


const Settings = ({ sidebarExpanded }) => {

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>

        </div>
    );
};

export default Settings;
