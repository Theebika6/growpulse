import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import { auth } from './firebaseConfig';
import LandingPageView from './Components/LandingPage/LandingPageView';
import LoginModal from './Components/LoginModal/LoginModal';
import SidebarController from './Components/SideBar/SidebarController';
import TopbarController from './Components/Header/HeaderController';
import AllSystems from "./Components/AllSystems/AllSystems";
import Overview from "./Components/Overview/Overview";
import SystemControl from './Components/SystemControl/SystemControl';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setIsEmailVerified(user.emailVerified);
            } else {
                setIsLoggedIn(false);
                setIsEmailVerified(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <div className="App">
            {isLoggedIn && isEmailVerified && <SidebarController show={sidebarExpanded} />}
                {isLoggedIn && isEmailVerified && <TopbarController 
                          toggleSidebar={() => setSidebarExpanded(prev => !prev)} 
                          sidebarExpanded={sidebarExpanded} 
                        />}
                {isLoggedIn && isEmailVerified ? (
                    <Routes>
                        <Route path="/" element={<Navigate to="/allSystems" />} />
                        <Route path="/allSystems" element={<AllSystems />} />
                        <Route path="/Overview/:systemName" element={<Overview key={window.location.pathname} sidebarExpanded={sidebarExpanded}/>} />
                        <Route path="/systemControl/:systemName" element={<SystemControl key={window.location.pathname} sidebarExpanded={sidebarExpanded}/>} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<LandingPageView />} />
                        {isLoggedIn ? (
                            <Route path="/allSystems" element={<AllSystems />} />
                        ) : (
                            <Route path="/login" element={<LoginModal />} />
                        )}
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
