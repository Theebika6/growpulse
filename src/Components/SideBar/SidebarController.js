import React from 'react';
import SidebarView from './SidebarView';

const SidebarController = ({ show }) => {
    if (!show) {
        return null;
    }
    return <SidebarView />;
};

export default SidebarController;
