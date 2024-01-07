import React from 'react';
import SidebarView from './SidebarView';

const SidebarController = ({ show }) => {
    const sidebarClass = show ? "" : "sidebar-collapsed";
    return <SidebarView sidebarClass={sidebarClass} />;
};

export default SidebarController;
