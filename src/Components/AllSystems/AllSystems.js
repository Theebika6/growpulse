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
import { fetchLogHistory } from '../Services/HistoryServices';


const AllSystems = ({ sidebarExpanded }) => {
    const [systemsData, setSystemsData] = useState([]);
    const [liveFeedData, setLiveFeedData] = useState({});
    const [dispensedData, setDispensedData] = useState({});
    const [flashUpdate, setFlashUpdate] = useState({});
    

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
    
        // Initialize light and pump status to OFF if not already set
        setLiveFeedData(prevState => {
            if (!prevState[systemName]) {
                return {
                    ...prevState,
                    [systemName]: {
                        lightPower: 'OFF',
                        pumpPower: 'OFF'
                    }
                };
            }
            return prevState;
        });

        fetchPhValue(value => updateSensorData('phValue', value, true), systemName);
        fetchTdsValue(value => updateSensorData('tdsValue', value, true), systemName);
        fetchAirTemperature(value => updateSensorData('airTemperature', value, true), systemName);
        fetchWaterTempValue(value => updateSensorData('waterTemperature', value, true), systemName);
        fetchHumidity(value => updateSensorData('humidity', value), systemName);

        fetchLigthPowerStatus(value => {
            if (value === true) {
                updateSensorData('lightPower', 'ON');
            }
        }, systemName);
        fetchMainPumpStatus(value => {
            if (value === true) {
                updateSensorData('pumpPower', 'ON');
            }
        }, systemName);

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
                const userRef = ref(database, `Registered Users/${currentUser.uid}`); 

                try {
                    const snapshot = await get(userRef); 
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
    
            return () => unsubscribe();
        }
    }, []);

    /*Dispense Amounts*/
    const aggregateDispensedData = (logHistory) => {
        const aggregatedData = {};
        logHistory.forEach(entry => {
            const { systemName, Type, Amount } = entry;
            if (!aggregatedData[systemName]) {
                aggregatedData[systemName] = { A: 0, B: 0, Up: 0, Down: 0 };
            }
            switch (Type) {
                case 'Manual pH Up':
                case 'Automatic pH Up':
                    aggregatedData[systemName].Up += Amount;
                    break;
                case 'Manual pH Down':
                case 'Automatic pH Down':
                    aggregatedData[systemName].Down += Amount;
                    break;
                case 'Initial Dose Sol. A':
                case 'Manual Dose Sol. A':
                    aggregatedData[systemName].A += Amount;
                    break;
                case 'Initial Dose Sol. B':
                case 'Manual Dose Sol. B':
                    aggregatedData[systemName].B += Amount;
                    break;
            }
        });
        return aggregatedData;
    };

    useEffect(() => {
        const initialDispensedData = {};
        systemsData.forEach(system => {
            initialDispensedData[system.systemName] = { A: 0, B: 0, Up: 0, Down: 0 };
        });
        setDispensedData(initialDispensedData);
    }, [systemsData]);

    useEffect(() => {
        // ... existing code for fetching and aggregating dispensed data
        systemsData.forEach(system => {
            fetchLogHistory((logHistory) => {
                const aggregatedData = aggregateDispensedData(logHistory);
                setDispensedData(prevData => ({ ...prevData, [system.systemName]: aggregatedData }));
            }, system.systemName);
        });
    }, [systemsData]);

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
                                            <td className={liveFeedData[system.systemName]?.lightPower === 'OFF' ? 'status-bad' : 'status-good'}>
                                                {liveFeedData[system.systemName]?.lightPower ?? '-'}
                                            </td>
                                            <td className={liveFeedData[system.systemName]?.pumpPower === 'OFF' ? 'status-bad' : 'status-good'}>
                                                {liveFeedData[system.systemName]?.pumpPower ?? '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container indiv-costs">
                        <h3>Amount Dispensed per System</h3>
                        <div className="amount-disp">
                            <table>
                                <thead>
                                    <tr>
                                        <th>System</th>
                                        <th>A (mL)</th>
                                        <th>B (mL)</th>
                                        <th>Up (mL)</th>
                                        <th>Down (mL)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {systemsData.map(system => (
                                        <tr key={system.systemName}>
                                            <td>{system.systemName}</td>
                                            <td>{dispensedData[system.systemName]?.A || '-'}</td>
                                            <td>{dispensedData[system.systemName]?.B || '-'}</td>
                                            <td>{dispensedData[system.systemName]?.Up || '-'}</td>
                                            <td>{dispensedData[system.systemName]?.Down || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container total-costs">
                        <h3>Total Amount Dispensed</h3>
                        {/* Add total solution costs content here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AllSystems;
