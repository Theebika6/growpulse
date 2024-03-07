import React, { useEffect, useState } from 'react';
import './Header.css';
import collapseLeft from '../Images/HeaderIcons/left_collapse.png';
import expandRight from '../Images/HeaderIcons/double-right.png';
import fullScreen from '../Images/HeaderIcons/full_screen.png';
import notificationIcon from '../Images/HeaderIcons/notification.png';
import tasks from '../Images/HeaderIcons/tasks.png';
import darkMode from '../Images/HeaderIcons/night-mode.png';
import lightMode from '../Images/HeaderIcons/sun-white.png';
import extendWhite from '../Images/HeaderIcons/extend-white.png';
import collapseWhite from '../Images/HeaderIcons/collapse-white.png';
import fullScreenWhite from '../Images/HeaderIcons/full-screen-white.png';
import notificationWhite from '../Images/HeaderIcons/notification-white.png';
import taskWhite from '../Images/HeaderIcons/task-list-white.png';


const HeaderView = ({ toggleSidebar, sidebarExpanded, toggleTheme, isDarkMode, fullName, handleLogout }) => {
    const formatDate = () => {
        const currentDate = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = currentDate.getDate();
        const month = monthNames[currentDate.getMonth()];
        let hours = currentDate.getHours();
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        // Convert 24 to 00
        if (hours === 24) {
            hours = 0;
        }
        const time = `${String(hours).padStart(2, '0')}:${minutes}`;

        return ` ${month} ${date} | ${time}`;
    };

    const [currentDateTime, setCurrentDateTime] = useState(formatDate());
    const topbarClass = sidebarExpanded ? "" : "topbar-expanded";

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(formatDate());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={`topbar ${topbarClass} ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="left-side">
                <img
                    src={sidebarExpanded ? (isDarkMode ? collapseWhite : collapseLeft) : (isDarkMode ? extendWhite : expandRight)}
                    alt={sidebarExpanded ? "Collapse" : "Expand"}
                    className="collapse-toggle"
                    onClick={toggleSidebar} />
                <h1>Hello, {fullName}</h1>
                <div className='current-date'>{currentDateTime}</div>
            </div>
            <div className="right-side">
                <img
                    src={isDarkMode ? lightMode : darkMode}
                    alt="Theme Toggle"
                    className="icons dark-mode-icon"
                    onClick={toggleTheme}
                />
                <img src={isDarkMode ? taskWhite : tasks} alt="Tasks" className="icons tasks" />
                <img src={isDarkMode ? notificationWhite : notificationIcon} alt="Notifications" className="icons" />
                <img src={isDarkMode ? fullScreenWhite : fullScreen} alt="Full Screen" className="icons" onClick={toggleFullScreen} />
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default HeaderView;
