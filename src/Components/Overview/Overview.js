import React, { useEffect, useState,  useRef, useCallback } from 'react';
import {useParams} from "react-router-dom";
import Chart from 'chart.js/auto';
import { fetchImage} from '../Services/CameraServices';
import {fetchPhAutoStatus, fetchPhValue} from "../Services/phServices";
import {fetchTdsValue} from "../Services/tdsServices";
import {fetchWaterTempValue} from "../Services/WaterTempServices";
import {fetchAirTemperature} from "../Services/AirTempServices";
import { fetchHumidity } from '../Services/HumidityServices';
import * as pumpService from "../Services/DosingPumpsServices";
import {createPhChart, createTdsChart, createWaterTemperatureChart, createAirTemperatureChart, fetchLastSevenSamples, createHumidityChart, fetchDayAverages, getChartData} from "../Services/chartsServices";
import { fetchLogHistory } from '../Services/HistoryServices';
import { handleToggleMainPump, fetchMainPumpStatus } from '../Services/MainPumpServices';
import { calculateDayNightDurations, handleToggleLight, fetchLightTimes, fetchLigthPowerStatus, createLightScheduleGanttChart } from '../Services/LightServices';

import on from "../Images/Dashboard/ON.png";
import off from "../Images/Dashboard/OFF.png";

import './Overview.css';

const Overview = ({ sidebarExpanded }) => {
    const {systemName } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    
    const [flashUpdate, setFlashUpdate] = useState(false);
    const [recentSamples, setRecentSamples] = useState({
        TDS: [],
        pH: [],
        AirTemperature: [],
        WaterTemperature: [],
        Humidity: [],
        Times: []
    });

    const [phValue, setPhValue] = useState(null);
    const [phAuto, setPhAuto] = useState(false);
    const [dp1Status, setDP1Status] = useState(false);
    const [dp2Status, setDP2Status] = useState(false); 
    const phChartRef = useRef(null);

    const [tdsValue, setTdsValue] = useState(null);
    const [dp3Status, setDP3Status] = useState(false);
    const [dp4Status, setDP4Status] = useState(false); 
    const TdsChartRef = useRef(null);

    const [waterTempValue, setWaterTempValue] = useState(null);
    const waterTempChartRef = useRef(null);
    
    const [MainPumpOn, setMainPumpOn] = useState(false);

    const [airTempValue, setAirTempValue] = useState(null);
    const airTempChartRef = useRef(null);

    const HumidityChartRef = useRef(null);
    const [humidityValue, setHumidityValue] = useState(null);
    //const [humidityAuto] = useState(false);
    //const [humidifierOn, setHumidifierOn] = useState(false);

    const [lightPwrOn, setLightPwrOn] = useState(null);
    const [lightON, setLightON] = useState(null);
    const [lightOFF, setLightOFF] = useState(null);
    const [lightAuto, setLightAuto] = useState(false);
    const { dayDuration, nightDuration } = lightON && lightOFF ? calculateDayNightDurations(lightON, lightOFF) : { dayDuration: 0, nightDuration: 0 };
    const dayHours = Math.floor(dayDuration / 60);
    const nightHours = Math.floor(nightDuration / 60);

    const [logHistory, setLogHistory] = useState([]);

    const avgChartRef = useRef(null);
    const [dayAverages, setDayAverages] = useState([]);

    /* Camera */
    /* Image Fetching */
    const loadImage = useCallback(async () => {
        const url = await fetchImage(systemName);
        setImageUrl(url); 
    }, [systemName]);

    /* pH */
    /* Live Feed Fetching */
    useEffect(() => {
        setPhValue(0);

        fetchPhValue((newPhValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setPhValue(newPhValue);
        }, systemName);

        fetchPhAutoStatus(setPhAuto, systemName);
    }, [systemName]);

    /* TDS */
    /* Live Feed Fetching */
    useEffect(() => {
        setTdsValue(0);

        fetchTdsValue((newTdsValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setTdsValue(newTdsValue);
        }, systemName);

    }, [systemName]);

    /* Water Temperature */
    /* Live Feed Fetching */
    useEffect(() => {
        setWaterTempValue(0);

        fetchWaterTempValue((newWaterTempValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setWaterTempValue(newWaterTempValue);
        }, systemName);

    }, [systemName]);

    /* Air Temperature */
    /* Live Feed Fetching */
    useEffect(() => {
        setAirTempValue(0);

        fetchAirTemperature((newAirTempValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setAirTempValue(newAirTempValue);
        }, systemName);

    }, [systemName]);

    /*Humidity*/
    /* ON/OFF Button functionality (empty for now) */

    /*

        const toggleHumidity = () => {
            setHumidifierOn(currentState => !currentState);
        }; 

        useEffect(() => {
            setHumidifierOn(false);
        }, [systemName]);
    
    */

    /* Live Feed Fetching */
    useEffect(() => {
        setHumidityValue(0);

        fetchHumidity((newHumidityValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setHumidityValue(newHumidityValue);
        }, systemName);

    }, [systemName]);

    /* Button State Fetching */ 
    // For DP1
    useEffect(() => {
        const unsubscribeDP1 = pumpService.fetchDP1Status(setDP1Status, systemName);
        return unsubscribeDP1;
    }, [systemName]);

    useEffect(() => {
        const unsubscribeDP2 = pumpService.fetchDP2Status(setDP2Status, systemName);
        return unsubscribeDP2;
    }, [systemName]);

    useEffect(() => {
        const unsubscribeDP3 = pumpService.fetchDP3Status(setDP3Status, systemName);
        return unsubscribeDP3;
    }, [systemName]);

    useEffect(() => {
        const unsubscribeDP4 = pumpService.fetchDP4Status(setDP4Status, systemName);
        return unsubscribeDP4;
    }, [systemName]);


    /*Main Pump*/
    useEffect(() => {
        const unsubscribe = fetchMainPumpStatus(setMainPumpOn, systemName);
        // Clean up the subscription
        return unsubscribe;
    }, [systemName]);
    

    const toggleMainPump = async () => {
        try {
          await handleToggleMainPump(systemName, !MainPumpOn); 
          setMainPumpOn(!MainPumpOn); 
        } catch (error) {
          console.error('Error toggling the main pump:', error);
        }
    };

    /*Light Control*/
    useEffect(() => {
        setLightON("00:00");
        setLightOFF("12:00");

        const cleanup = fetchLightTimes(setLightON, setLightOFF, setLightAuto, systemName);

        return () => {
            cleanup();
        };

    }, [systemName]);

    useEffect(() => {
        const unsubscribe = fetchLigthPowerStatus(setLightPwrOn, systemName);
        // Clean up the subscription
        return unsubscribe;
    }, [systemName]);
    
    const toggleLight = async () => {
        try {
            await handleToggleLight(systemName); 
            } catch (error) {
            console.error('Error toggling the light power:', error);
        }
    };

    useEffect(() => {
        if (lightON && lightOFF) {
            createLightScheduleGanttChart('lightScheduleGanttChartContainer', lightON, lightOFF);
        }
    }, [lightON, lightOFF]);

    /* Dispense History */
    /* Fetching and displaying */
    useEffect(() => {
        fetchLogHistory(setLogHistory, systemName);
    }, [systemName]);

    /* Common Fetches */
    useEffect(() => {
        loadImage();
    }, [loadImage]);

    /* Live Feed Charts */

    const initializeCharts = useCallback(() => {

        setTimeout(() => {
            const phCtx = document.getElementById('phChart');
            const tdsCtx = document.getElementById('tdsChart');
            const waterTempCtx = document.getElementById('waterTempChart');
            const airTempCtx = document.getElementById('airTempChart');
            const humidityCtx = document.getElementById('HumidityChart');

            if (recentSamples.pH.length > 0) {
                phChartRef.current = createPhChart(phCtx.getContext('2d'), recentSamples, phChartRef);
            } 
            if (recentSamples.TDS.length > 0) {
                TdsChartRef.current = createTdsChart(tdsCtx.getContext('2d'), recentSamples, TdsChartRef);
            }
            if (recentSamples.WaterTemperature.length > 0) {
                waterTempChartRef.current = createWaterTemperatureChart(waterTempCtx.getContext('2d'), recentSamples, waterTempChartRef);
            }
            if (recentSamples.AirTemperature.length > 0) {
                airTempChartRef.current = createAirTemperatureChart(airTempCtx.getContext('2d'), recentSamples, airTempChartRef);
            }
            if (recentSamples.Humidity.length > 0) {
                HumidityChartRef.current = createHumidityChart(humidityCtx.getContext('2d'), recentSamples, HumidityChartRef);
            }

        }, 0);
    }, [recentSamples]);

    useEffect(() => {
        initializeCharts();
    }, [recentSamples, initializeCharts]);

    const resetChartData = () => {
        // Destroy existing charts
        if (phChartRef.current) phChartRef.current.destroy();
        if (TdsChartRef.current) TdsChartRef.current.destroy();
        if (waterTempChartRef.current) waterTempChartRef.current.destroy();
        if (airTempChartRef.current) airTempChartRef.current.destroy();
        if (HumidityChartRef.current) HumidityChartRef.current.destroy();
    
        // Reset chart data
        setRecentSamples({
            TDS: [],
            pH: [],
            AirTemperature: [],
            WaterTemperature: [],
            Humidity: [],
            Times: []
        });
    };

    useEffect(() => {

        resetChartData();
        fetchLastSevenSamples(setRecentSamples, systemName);

    }, [systemName]);

    /*Daily Avg Chart*/
    useEffect(() => {
        fetchDayAverages(setDayAverages, systemName);
    }, [systemName]);

    useEffect(() => {
        // Function to redraw the chart
        const redrawChart = () => {
            if (window.myAvgChart) {
                window.myAvgChart.destroy();
            }
    
            const avgChartData = getChartData(dayAverages);
    
            window.myAvgChart = new Chart(avgChartRef.current, {
                type: 'bar',
                data: avgChartData,
                options: {
                    animation: {
                        duration: 10,
                    },
                    scales: {
                        x: {
                            title: {
                                display: false,
                                text: 'Date',
                            },
                        },
                        y: {
                            title: {
                                display: false,
                                text: 'Sensor Values',
                            },
                        },
                        'y-axis-tds': {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'TDS',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }
            });
        };
    
        // Refresh the chart after a delay when the sidebar collapses
        if (!sidebarExpanded) {
            const timeoutId = setTimeout(redrawChart, 300); // Delay in ms to match sidebar transition
            return () => clearTimeout(timeoutId);
        }
    }, [dayAverages, sidebarExpanded]); // Dependency array includes sidebarExpanded to trigger effect when it changes    

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}> {/* css file in src/Components/Common */}
            <div className="overview">
                <header className="header-text">
                    <h2>Here is the overview of your {systemName}:</h2>
                </header>
                <main className="overview-main">

                    {/*Camera*/}
                    <div className="container camera-container">
                        <h3>Camera</h3>
                            {imageUrl === null ? (
                                <p className="no-image">No Image Found</p>
                            ) : imageUrl ? (
                                <img className="camera" src={imageUrl} alt="Camera"/>
                            ) : (
                                <p className="no-image">Loading image...</p>
                            )}
                    </div>

                    {/*pH*/}
                    <div className="container ph-container">
                        <h3>pH</h3>
                        <div className="control">
                            <div>
                                <p className={flashUpdate ? 'flash-animation' : ''}>{phValue}</p>
                            </div>
                            <div className="control auto">
                                <div className="control buttons">
                                    <button
                                        className={`arrow-button ${dp1Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP1', systemName)}
                                    >
                                        &#9650;
                                    </button>
                                    <button
                                        className={`arrow-button ${dp2Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP2', systemName)}
                                    >
                                        &#9660;
                                    </button>
                                </div>
                                <h5 style={phAuto ? { color: '#08B200', fontSize: '16px' } : {}} >Auto</h5>
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="phChart"></canvas>
                        </div>
                    </div>

                    {/*TDS*/}
                    <div className="container TDS-container">
                        <h3>TDS</h3>
                        <div className="control">
                            <div>
                                <p className={flashUpdate ? 'flash-animation' : ''}>{tdsValue} ppm</p>
                            </div>
                            <div className="control auto tds-buttons">
                                <div className="control button">
                                    <button
                                        className={`arrow-button ${dp3Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP3',systemName)}
                                    >
                                        A
                                    </button>
                                    <button
                                        className={`arrow-button ${dp4Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP4',systemName)}
                                    >
                                        B
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="tdsChart"></canvas>
                        </div>
                    </div>

                    {/*Water Temperature*/}
                    <div className="container Water-Temperature-container">
                        <h3>Water Temperature</h3>
                        <div className="control">
                            <div>
                                <p className={flashUpdate ? 'flash-animation' : ''}>{waterTempValue} °C</p>
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="waterTempChart"></canvas>
                        </div>
                    </div>

                    {/*Main Pump*/}
                    <div className="container main-pump-container">
                        <h3>Main Pump</h3>
                        <div className="control">
                            <div className="control auto main-pump-button">
                                <div className="control button">
                                    <button
                                        className={`on-off-button ${MainPumpOn ? 'on' : 'off'}`}
                                        onClick={toggleMainPump}
                                        >
                                        <img
                                            src={MainPumpOn ? on : off}
                                            alt={MainPumpOn ? "Main Pump On" : "Main Pump Off"}
                                        />
                                        <span style={{ color: MainPumpOn ? '#0096ff' : 'grey' }}>
                                            {MainPumpOn ? 'On' : 'Off'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Air Temperature*/}
                    <div className="container temperature-container">
                        <h3>Air Temperature</h3>
                        <div>
                            <p className={flashUpdate ? 'flash-animation' : ''}>{airTempValue} °C</p>
                        </div>
                        <div className="chart">
                            <canvas id="airTempChart"></canvas>
                        </div>
                    </div>

                    {/*Humidity*/}
                    <div className="container humidity-container">
                        <h3>Humidity</h3>
                        <div className="control">
                            <div>
                                <p className={flashUpdate ? 'flash-animation' : ''}>{humidityValue} %</p>
                            </div>
                            <div className="control auto auto-hum">
                                {/*
                                <div className="control button">
                                    <button
                                        className="on-off-button"
                                        onClick={toggleHumidity}
                                    >
                                        <img src={humidifierOn ? on : off} alt={humidifierOn ? "Humidifier On" : "Humidifier Off"} />
                                        <span style={{ color: humidifierOn ? '#0096ff' : 'grey' }}>{humidifierOn ? 'On' : 'Off'}</span>
                                    </button>
                                </div>
                                <h5 style={humidityAuto ? { color: '#08B200', fontSize: '16px' } : {}} >Auto</h5>
                                */}
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="HumidityChart"></canvas>
                        </div>
                    </div>

                    {/*Light Control*/}
                    <div className="container light-container" key={systemName}>
                        <h3>Light Schedule</h3>
                        <div className="control">
                            <div>
                                <p>{dayHours}hrs<span className="Day-Night"> Light</span>/{nightHours}hrs<span className="Day-Night"> Dark</span></p>
                            </div>
                            <div className="control auto auto-hum">
                                <div className="control button">
                                <button
                                        className={`on-off-button ${lightPwrOn ? 'on' : 'off'}`}
                                        onClick={toggleLight}
                                        >
                                        <img
                                            src={lightPwrOn ? on : off}
                                            alt={lightPwrOn ? "light Power On" : "light Power Off"}
                                        />
                                        <span style={{ color: lightPwrOn ? '#0096ff' : 'grey' }}>
                                            {lightPwrOn ? 'On' : 'Off'}
                                        </span>
                                    </button>
                                </div>
                                <h5 style={lightAuto ? { color: '#52e000', fontSize: '16px' } : {}} >Auto</h5>
                            </div>
                        </div>
                        <div id="lightScheduleGanttChartContainer" className="chart-gantt">
                        </div>
                    </div>

                    {/* Disposal History */}
                    <div className="container log-container">
                        <h3>Disposal History</h3>
                        <div className="disposal-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                            </table>
                            <div className="table-body-wrapper">
                                <table>
                                    <tbody>
                                    {logHistory.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.Type}</td>
                                            <td>{entry.Amount}mL</td>
                                            <td>{entry.time}</td>
                                            <td>{entry.date}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/*Daily Avg Chart*/}
                    <div className="container avg-chart-container">
                        <h3>Average Chart</h3>
                        <div className="avg-chart">
                            <canvas ref={avgChartRef} id="avgChart"></canvas>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;
