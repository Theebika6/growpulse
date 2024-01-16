import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import './AllSystems.css';
import '../Common/background.css';
import worldMap from './countries-110m.json';
import countriesCoordinates from './countriesCoordinates.json';
import { database, auth } from '../../firebaseConfig';
import { ref, get } from 'firebase/database';

const AllSystems = ({ sidebarExpanded }) => {
    const [systemsData, setSystemsData] = useState([]);
    

    /*Map Locations*/
    const systemsCountPerCountry = systemsData.reduce((acc, system) => {
        acc[system.Location] = (acc[system.Location] || 0) + 1;
        return acc;
      }, {});

    
    /*Fetch All User's Systems*/
    useEffect(() => {
        const fetchSystemsData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userRef = ref(database, `Registered Users/${currentUser.uid}`); // Updated for Firebase v9

                try {
                    const snapshot = await get(userRef); // Updated for Firebase v9
                    if (snapshot.exists()) {
                        const fetchedSystemsData = [];
                        snapshot.forEach(childSnapshot => {
                            const systemName = childSnapshot.key;
                            if (systemName.startsWith("System")) {
                                const { Location, Status } = childSnapshot.val();
                                fetchedSystemsData.push({ systemName, Location, Status });
                            }
                        });
                        setSystemsData(fetchedSystemsData);
                    } else {
                        console.log("No systems available");
                    }
                } catch (error) {
                    console.error("Error fetching systems:", error);
                }
            }
        };

        fetchSystemsData();
    }, []);

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className="allSystems">
                <header>
                    <h2 className="Header">Quick view of all of your systems:</h2>
                </header>
                <main className='overview-main'>
                    <div className="map-container">
                        <ComposableMap>
                            <Geographies geography={worldMap}>
                                {({ geographies }) =>
                                    geographies.map(geo => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            className="geography"
                                            onClick={(event) => event.preventDefault()}
                                            style={{
                                                default: { fill: "#00000000", stroke: "#888888" },
                                                hover: { fill: "#006effb7" },
                                                pressed: { fill: "#006effb7" }
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {Object.entries(systemsCountPerCountry).map(([country, count]) => {
                                const { coordinates } = countriesCoordinates[country] || {};
                                if (!coordinates) return null;
                                return (
                                <Marker key={country} coordinates={coordinates}>
                                    <circle r={10} fill="#FF5533" stroke="#fff" strokeWidth={2} />
                                    <text textAnchor="middle" y={-12} style={{ fontSize: 14, fontWeight: 'bold' }}>
                                    {count}
                                    </text>
                                </Marker>
                                );
                            })}
                        </ComposableMap>
                    </div>
                    <div className="container current-systems">
                        <h3>Your Current Systems</h3>
                        <div className="table-curr-sys">
                            <table className="table-header">
                                <thead>
                                    <tr>
                                        <th>System Name</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                            </table>
                            <table className="table-body">
                                <tbody>
                                    {systemsData.map(system => (
                                        <tr key={system.systemName}>
                                            <td>{system.systemName}</td>
                                            <td>{system.Location}</td>
                                            <td className={system.Status ? 'status-good' : 'status-bad'}>
                                                {system.Status ? "Good" : "Needs Attention!"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container Live-Feed-AllSystems">
                        <h3>Live Feed</h3>
                        {/* Add live feed content here */}
                    </div>
                    <div className="container indiv-costs">
                        <h3>Solution Costs</h3>
                        {/* Add solution costs content here */}
                    </div>
                    <div className="container total-costs">
                        <h3>Total Sol. Costs</h3>
                        {/* Add total solution costs content here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AllSystems;
