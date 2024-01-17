import React, { useEffect, useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import './AllSystems.css';
import '../Common/background.css';
import worldMap from './countries-110m.json';
import countriesCoordinates from './countriesCoordinates.json';
import { database, auth } from '../../firebaseConfig';
import { ref, get, update, onValue } from 'firebase/database';
import { fetchPhValue } from '../Services/phServices';
import { fetchTdsValue } from '../Services/tdsServices';
import { fetchAirTemperature } from '../Services/AirTempServices';
import { fetchWaterTempValue } from '../Services/WaterTempServices';
import { fetchHumidity } from '../Services/HumidityServices';
import { fetchLigthPowerStatus } from '../Services/LightServices';
import { fetchMainPumpStatus } from '../Services/MainPumpServices';

const AllSystems = ({ sidebarExpanded }) => {
    const [systemsData, setSystemsData] = useState([]);
    const [liveFeedData, setLiveFeedData] = useState({});
    const [flashUpdate, setFlashUpdate] = useState({});
    
    const formatPowerStatus = (status) => status ? 'ON' : 'OFF';

    const fetchSystemLiveFeed = useCallback((systemName) => {
        const updateSensorData = (sensorName, value, isNumeric = false) => {

            let formattedValue = '-';
            if (isNumeric) {
                if (value !== null && !isNaN(parseFloat(value))) {
                    formattedValue = parseFloat(value).toFixed(2);
                }
            } else {
                formattedValue = value !== null ? value : '-';
            }

            setLiveFeedData(prevState => ({
                ...prevState,
                [systemName]: {
                    ...prevState[systemName],
                    [sensorName]: formattedValue
                }
            }));

            setFlashUpdate(prevState => ({
                ...prevState,
                [sensorName]: true
            }));
        
            setTimeout(() => {
                setFlashUpdate(prevState => ({
                    ...prevState,
                    [sensorName]: false
                }));
            }, 1000);
        };

        fetchPhValue(value => updateSensorData('phValue', value, true), systemName);
        fetchTdsValue(value => updateSensorData('tdsValue', value, true), systemName);
        fetchAirTemperature(value => updateSensorData('airTemperature', value, true), systemName);
        fetchWaterTempValue(value => updateSensorData('waterTemperature', value, true), systemName);
        fetchHumidity(value => updateSensorData('humidity', value), systemName);
        fetchLigthPowerStatus(value => updateSensorData('lightPower', formatPowerStatus(value)), systemName);
        fetchMainPumpStatus(value => updateSensorData('pumpPower', formatPowerStatus(value)), systemName);
    }, []);

    useEffect(() => {
        systemsData.forEach(system => {
            fetchSystemLiveFeed(system.systemName);
        });
    }, [systemsData, fetchSystemLiveFeed]);
    

    /*Map Locations*/
    const systemsCountPerCountry = systemsData.reduce((acc, system) => {
        acc[system.Location] = (acc[system.Location] || 0) + 1;
        return acc;
    }, {});

    const handleLocationChange = async (event, systemName, index) => {
        const newLocation = event.target.value;
        // Update the database
        const systemRef = ref(database, `Registered Users/${auth.currentUser.uid}/${systemName}`);
    
        try {
          await update(systemRef, { Location: newLocation });
          // Update the state
          const updatedSystemsData = [...systemsData];
          updatedSystemsData[index].Location = newLocation;
          setSystemsData(updatedSystemsData);
        } catch (error) {
          console.error("Error updating location:", error);
        }
    };         

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

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userRef = ref(database, `Registered Users/${currentUser.uid}`);
    
            const unsubscribe = onValue(userRef, (snapshot) => {
                const fetchedSystemsData = [];
                snapshot.forEach(childSnapshot => {
                    const systemName = childSnapshot.key;
                    if (systemName.startsWith("System")) {
                        const { Location, Status } = childSnapshot.val();
                        fetchedSystemsData.push({ systemName, Location, Status });
                    }
                });
                setSystemsData(fetchedSystemsData);
            }, {
                onlyOnce: false
            });
    
            // Cleanup subscription on component unmount
            return () => unsubscribe();
        }
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
                                    <circle r={17} fill="#0099ff" stroke="#fff" strokeWidth={2} />
                                    <text textAnchor="middle" y={5} style={{ fontSize: 24, fontWeight: 'bold', fill: '#FFF' }}>
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
                                        <th>System</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                            </table>
                            <table className="table-body">
                                <tbody>
                                    {systemsData.map((system, index) => (
                                    <tr key={system.systemName}>
                                        <td>{system.systemName}</td>
                                        <td>
                                        <select
                                            value={system.Location}
                                            className="custom-select location"
                                            onChange={(e) => handleLocationChange(e, system.systemName, index)}>
                                            {Object.keys(countriesCoordinates).map(country => (
                                            <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                        </td>
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
                        <div className="table-live-feed">
                            <table>
                                <thead>
                                    <tr>
                                        <th>System</th>
                                        <th>pH</th>
                                        <th>TDS</th>
                                        <th>Water Temp.</th>
                                        <th>Humidity</th>
                                        <th>Air Temp.</th>
                                        <th>Light</th>
                                        <th>Main Pump</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {systemsData.map(system => (
                                        <tr key={system.systemName}>
                                            <td>{system.systemName}</td>
                                            <td className={flashUpdate['phValue'] ? 'flash-animation' : ''}> {liveFeedData[system.systemName]?.phValue ?? '-'} </td>
                                            <td className={flashUpdate['tdsValue'] ? 'flash-animation' : ''}>{liveFeedData[system.systemName]?.tdsValue ? `${liveFeedData[system.systemName].tdsValue} ppm` : '-'}</td>
                                            <td className={flashUpdate['waterTemperature'] ? 'flash-animation' : ''}>{liveFeedData[system.systemName]?.waterTemperature ? `${liveFeedData[system.systemName].waterTemperature} °C` : '-'}</td>
                                            <td className={flashUpdate['humidity'] ? 'flash-animation' : ''}>{liveFeedData[system.systemName]?.humidity ? `${liveFeedData[system.systemName].humidity} %` : '-'}</td>
                                            <td className={flashUpdate['airTemperature'] ? 'flash-animation' : ''}>{liveFeedData[system.systemName]?.airTemperature ? `${liveFeedData[system.systemName].airTemperature} °C` : '-'}</td>
                                            <td className={liveFeedData[system.systemName]?.lightPower === 'ON' ? 'status-good' : 'status-bad'}>
                                                {liveFeedData[system.systemName]?.lightPower ?? '-'}
                                            </td>
                                            <td className={liveFeedData[system.systemName]?.pumpPower === 'ON' ? 'status-good' : 'status-bad'}>
                                                {liveFeedData[system.systemName]?.pumpPower ?? '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
