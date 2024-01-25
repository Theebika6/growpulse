import React, { useEffect, useState } from 'react';
import './Header.css';
import collapseLeft from '../Images/HeaderIcons/left_collapse.png';
import expandRight from '../Images/HeaderIcons/double-right.png';
import fullScreen from '../Images/HeaderIcons/full_screen.png';
import notificationIcon from '../Images/HeaderIcons/notification.png';
import tasks from '../Images/HeaderIcons/tasks.png';
import darkMode from '../Images/HeaderIcons/night-mode.png';
import lightMode from '../Images/HeaderIcons/light-mode.png';

const HeaderView = ({ toggleSidebar, sidebarExpanded, fullName, handleLogout }) => {
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
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

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
        <div className={`topbar ${topbarClass}`}>
        <div className="left-side">
        <img src={sidebarExpanded ? collapseLeft : expandRight}
                 alt={sidebarExpanded ? "collapse-left" : "expand-right"}
                 className="collapse-toggle"
                 onClick={toggleSidebar} />
                <h1>Hello, {fullName}</h1>
                <div className='current-date'>{currentDateTime}</div>
            </div>
            <div className="right-side">
                <img
                    src={isDarkMode ? lightMode : darkMode}
                    alt={isDarkMode ? "light-mode-icon" : "dark-mode-icon"}
                    className={"dark-mode-icon"}
                    onClick={toggleTheme}
                />
                <img src={tasks} alt={"task-icon"} className={"icons"}/>
                <img src={notificationIcon} alt={"notification-icon"} className={"icons"}/>
                <img src={fullScreen} alt={"full-screen"} className={"icons"} onClick={toggleFullScreen}/>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default HeaderView;
