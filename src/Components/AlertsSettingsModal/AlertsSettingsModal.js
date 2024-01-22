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

    const handleChange = (currentValue, operation, setValue, limitMin, limitMax) => {
        let newValue = parseFloat(currentValue);

        if (operation === 'increment') {
            newValue = newValue + 1;
            if (newValue > limitMax) {
                newValue = limitMax;
            }
        } else if (operation === 'decrement') {
            newValue = newValue - 1;
            if (newValue < limitMin) {
                newValue = limitMin;
            }
        }
        setValue(newValue.toString());
    };

    const handleChangeTDS = (currentValue, operation, setValue, limitMin, limitMax) => {
        let newValue = parseFloat(currentValue);

        if (operation === 'increment') {
            newValue = newValue + 10;
            if (newValue > limitMax) {
                newValue = limitMax;
            }
        } else if (operation === 'decrement') {
            newValue = newValue - 10;
            if (newValue < limitMin) {
                newValue = limitMin;
            }
        }
        setValue(newValue.toString());
    };

    return (
        <div className="alerts-modal-container">
            <div className="alerts-modal">
                <h2>Alerts Settings for {systemName}</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>pH</td>
                        <td>
                            Min:
                            <div className="input-container">
                                <button onClick={() => handleChange(phMin, 'decrement', setPhMin, 0, phMax)}> - </button>
                                <input type="number" value={phMin} onChange={(e) => setPhMin(e.target.value)} />
                                <button onClick={() => handleChange(phMin, 'increment', setPhMin, 0, phMax)}> + </button>
                            </div>
                            Max:
                            <div className="input-container">
                                <button onClick={() => handleChange(phMax, 'decrement', setPhMax, phMin, 14)}> - </button>
                                <input type="number" value={phMax} onChange={(e) => setPhMax(e.target.value)} />
                                <button onClick={() => handleChange(phMax, 'increment', setPhMax, phMin, 14)}> + </button>
                            </div>
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
                            Min:
                            <div className="input-container">
                                <button onClick={() => handleChange(waterTempMin, 'decrement', setWaterTempMin, 0, waterTempMax)}> - </button>
                                <input type="number" value={waterTempMin} onChange={(e) => setWaterTempMin(e.target.value)} />
                                <button onClick={() => handleChange(waterTempMin, 'increment', setWaterTempMin, 0, waterTempMax)}> + </button>
                            </div>
                            Max:
                            <div className="input-container">
                                <button onClick={() => handleChange(waterTempMax, 'decrement', setWaterTempMax, waterTempMin, 24)}> - </button>
                                <input type="number" value={waterTempMax} onChange={(e) => setWaterTempMax(e.target.value)} />
                                <button onClick={() => handleChange(waterTempMax, 'increment', setWaterTempMax, waterTempMin, 24)}> + </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td className="slider-text">
                            <span>Offset:</span>
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
                            Min:
                            <div className="input-container">
                                <button onClick={() => handleChange(airTempMin, 'decrement', setAirTempMin, 0, airTempMax)}> - </button>
                                <input type="number" value={airTempMin} onChange={(e) => setAirTempMin(e.target.value)} />
                                <button onClick={() => handleChange(airTempMin, 'increment', setAirTempMin, 0, airTempMax)}> + </button>
                            </div>
                            Max:
                            <div className="input-container">
                                <button onClick={() => handleChange(airTempMax, 'decrement', setAirTempMax, airTempMin, 30)}> - </button>
                                <input type="number" value={airTempMax} onChange={(e) => setAirTempMax(e.target.value)} />
                                <button onClick={() => handleChange(airTempMax, 'increment', setAirTempMax, airTempMin, 30)}> + </button>
                            </div>
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
