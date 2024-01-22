import React, { useState, useEffect } from 'react';
import './AlertsSettingsModal.css';
import {
    fetchPhMin, fetchPhMax,
    fetchTdsMin,
    fetchWaterTempMin, fetchWaterTempMax,
    fetchAirTempMin, fetchAirTempMax,
    fetchHumidityOffset
} from '../Services/AlertsServices';

const AlertsSettingsModal = ({ systemName, onClose }) => {
    const [phMin, setPhMin] = useState('');
    const [phMax, setPhMax] = useState('');
    const [tdsMin, setTdsMin] = useState('');
    const [waterTempMin, setWaterTempMin] = useState('');
    const [waterTempMax, setWaterTempMax] = useState('');
    const [airTempMin, setAirTempMin] = useState('');
    const [airTempMax, setAirTempMax] = useState('');
    const [humidityOffset, setHumidityOffset] = useState('');

    useEffect(() => {
        fetchPhMin(setPhMin, systemName);
        fetchPhMax(setPhMax, systemName);
        fetchTdsMin(setTdsMin, systemName);
        fetchWaterTempMin(setWaterTempMin, systemName);
        fetchWaterTempMax(setWaterTempMax, systemName);
        fetchAirTempMin(setAirTempMin, systemName);
        fetchAirTempMax(setAirTempMax, systemName);
        fetchHumidityOffset(setHumidityOffset, systemName);
    }, [systemName]);

    return (
        <div className="alerts-modal-container">
            <div className="alerts-modal">
                <h2>Alerts Settings for {systemName}</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>pH</td>
                        <td>
                            Min: <input type="number" value={phMin} onChange={(e) => setPhMin(e.target.value)} />
                            Max: <input type="number" value={phMax} onChange={(e) => setPhMax(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>TDS</td>
                        <td>
                            Min: <input type="range" min="0" max="2000" value={tdsMin} onChange={(e) => setTdsMin(e.target.value)} />
                            <span>{tdsMin} ppm</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Water Temp</td>
                        <td>
                            Min: <input type="number" value={waterTempMin} onChange={(e) => setWaterTempMin(e.target.value)} />
                            Max: <input type="number" value={waterTempMax} onChange={(e) => setWaterTempMax(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td>
                            Offset:
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={humidityOffset}
                                onChange={(e) => setHumidityOffset(e.target.value)}
                            />
                            <span>{humidityOffset}%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>Air Temp</td>
                        <td>
                            Min: <input type="number" value={airTempMin} onChange={(e) => setAirTempMin(e.target.value)} />
                            Max: <input type="number" value={airTempMax} onChange={(e) => setAirTempMax(e.target.value)} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AlertsSettingsModal;
