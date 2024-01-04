import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import GrowPulseLogo from '../Images/GrowpulseLogos/growpulse-high-resolution-logo-transparent.png';
import systemIcon from '../Images/SidebarIcons/system.png';
import expand from '../Images/SidebarIcons/down.png';
import collapse from '../Images/SidebarIcons/up.png';
import { database, auth } from '../../firebaseConfig';
import overviewIcon from '../Images/SidebarIcons/overview.png';
import notificationIcon from '../Images/HeaderIcons/notification.png';
import settingsIcon from '../Images/SidebarIcons/settings.png';
import supportIcon from '../Images/SidebarIcons/support.png';
import { ref, get } from 'firebase/database';

const SidebarView = () => {
    const [expandedSystem, setExpandedSystem] = useState(null);
    const [systems, setSystems] = useState([]);

    useEffect(() => {
        const fetchSystems = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Using ref to create a reference to the database path
                const userRef = ref(database, `Registered Users/${currentUser.uid}`);

                try {
                    // Fetching the data from the database reference
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const fetchedSystems = [];
                        snapshot.forEach(childSnapshot => {
                            const systemName = childSnapshot.key;
                            if (systemName.startsWith("System")) {
                                fetchedSystems.push(systemName);
                            }
                        });
                        setSystems(fetchedSystems); // Update the state with the fetched systems
                    } else {
                        console.log("No systems available"); // Handle the case where no data exists
                    }
                } catch (error) {
                    console.error("Error fetching systems:", error); // Handling errors
                }
            }
        };

        fetchSystems(); // Call the async function to fetch systems
    }, []);

    const handleSystemToggle = (system) => {
        if (expandedSystem === system) {
            setExpandedSystem(null);
        } else {
            setExpandedSystem(system);
        }
    };

    const handleOverview = () => {
        // ... handle Overview action
    };

    return (
        <div className="sidebar">
            <img src={GrowPulseLogo} alt="Header Icon" className="sidebar-icon"/>
            <ul>
                <li>
                    <h2>Overview</h2>
                    <div className="Overview" onClick={handleOverview}>
                        <Link to="/allSystems" className="Overview-link">
                            <img src={overviewIcon} alt="overview Icon" className="subtitle-icon"/>
                        </Link>
                        <Link to="/allSystems" className="Overview-link">
                            <h3>All Systems</h3>
                        </Link>
                    </div>
                </li>

                <li>
                    <h2>Individual Systems<span className="systems-number">{systems.length}</span></h2>
                    {systems.map((system, index) => (
                        <div key={index}>
                            <div className="Dashboards" onClick={() => handleSystemToggle(system)}>
                                <img src={systemIcon} alt="system Icon" className="system-icon"/>
                                <div className="h3-container">
                                    <h3>{system}</h3>
                                </div>
                                <img src={expandedSystem === system ? collapse : expand} alt="Expand Icon" className="expand"/>
                            </div>
                            {expandedSystem === system && (
                                <div className="bullet-points">
                                    <Link to={`/systemOverview/${system}`}>• Overview</Link>
                                    <Link to={`/systemControl/${system}`}>• System Control</Link>
                                    <Link to={`/schedule/${system}`}>• Schedule</Link>
                                </div>
                            )}
                        </div>
                    ))}
                </li>
                <li>
                    <h2>Alerts</h2>
                    <div className="Overview" onClick={handleOverview}>
                        <img src={notificationIcon} alt="notification Icon" className="subtitle-icon"/>
                        <div className="h3-container">
                            <h3>System Alerts</h3>
                        </div>
                    </div>
                </li>
                <li>
                    <h2>Settings</h2>
                    <div className="Overview" onClick={handleOverview}>
                        <img src={settingsIcon} alt="settings Icon" className="subtitle-icon"/>
                        <div className="h3-container">
                            <h3>Account Settings</h3>
                        </div>
                    </div>
                    <div className="Overview" onClick={handleOverview}>
                        <img src={supportIcon} alt="support Icon" className="subtitle-icon"/>
                        <div className="h3-container">
                            <h3>Help</h3>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default SidebarView;
