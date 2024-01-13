import React, { useEffect, useState,  useRef, useCallback } from 'react';
import {useParams} from "react-router-dom";
import { fetchImage} from '../Services/CameraServices';
import {fetchPhAutoStatus, fetchPhValue} from "../Services/phServices";
import {fetchTdsValue} from "../Services/tdsServices";
import {fetchWaterTempValue} from "../Services/WaterTempServices";
import {fetchAirTemperature} from "../Services/AirTempServices";
import * as pumpService from "../Services/DosingPumpsServices";
import {createPhChart, createTdsChart, createWaterTemperatureChart, createAirTemperatureChart, fetchLastSevenSamples, createHumidityChart} from "../Services/chartsServices";
import { fetchLogHistory } from '../Services/HistoryServices';
import on from "../Images/Dashboard/ON.png";
import off from "../Images/Dashboard/OFF.png";

import './Overview.css';
import { fetchHumidity } from '../Services/HumidityServices';

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

    const [airTempValue, setAirTempValue] = useState(null);
    const airTempChartRef = useRef(null);

    const HumidityChartRef = useRef(null);
    const [humidityValue, setHumidityValue] = useState(null);
    const [humidityAuto] = useState(false);
    const [humidifierOn, setHumidifierOn] = useState(false);

    const [logHistory, setLogHistory] = useState([]);

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
    const toggleHumidity = () => {
        setHumidifierOn(currentState => !currentState);
    };

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
    const initializeDosingPumpsStatus = useCallback(() => {
        pumpService.fetchDP1Status(setDP1Status, () => {}, systemName);
        pumpService.fetchDP2Status(setDP2Status, () => {}, systemName);
        pumpService.fetchDP3Status(setDP3Status, () => {}, systemName);
        pumpService.fetchDP4Status(setDP4Status, () => {}, systemName);
    }, [systemName]);

    /* Dispense History */
    /* Fetching and displaying */
    useEffect(() => {
        fetchLogHistory(setLogHistory, systemName);
    }, [systemName]);

    /* Common Fetches */
    useEffect(() => {
        loadImage();
        initializeDosingPumpsStatus();
    }, [loadImage, initializeDosingPumpsStatus]);

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
        }, 300);
    }, [recentSamples]);

    useEffect(() => {
        fetchLastSevenSamples(setRecentSamples, systemName);
    }, [systemName]);

    useEffect(() => {
        initializeCharts();
    }, [recentSamples, initializeCharts]);

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
                                        className="on-off-button"
                                    >
                                        <img src={humidifierOn ? on : off} alt={humidifierOn ? "Humidifier On" : "Humidifier Off"} />
                                        <span style={{ color: humidifierOn ? '#0096ff' : 'grey' }}>{humidifierOn ? 'On' : 'Off'}</span>
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
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="HumidityChart"></canvas>
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
                </main>
            </div>
        </div>
    );
};

export default Overview;
