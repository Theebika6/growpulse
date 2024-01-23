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
    const formatValue = (value) => parseFloat(value).toFixed(2);

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
        newValue = Math.min(Math.max(newValue, limitMin), limitMax);
        setValue(formatValue(newValue));
    };

    const handleSliderChange = (e, setValue) => {
        setValue(formatValue(e.target.value));
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === "alerts-modal-container") {
            onClose();
        }
    };

    return (
        <div className="alerts-modal-container" onClick={handleOutsideClick}>
            <div className="alerts-modal">
                <div className='modal-header'>
                    <h2>Alerts Settings for {systemName}</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <h4>pH:</h4>
                        <td>
                            <span>Min:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(phMin, 'decrement', setPhMin, 0, phMax)}> - </button>
                                <input className='input-text' type="text" value={phMin} onChange={(e) => setPhMin(e.target.value)} readOnly/>
                                <button onClick={() => handleChange(phMin, 'increment', setPhMin, 0, phMax)}> + </button>
                            </div>
                            <span>Max:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(phMax, 'decrement', setPhMax, phMin, 14)}> - </button>
                                <input className='input-text' type="text" value={phMax} onChange={(e) => setPhMax(e.target.value)}  readOnly/>
                                <button onClick={() => handleChange(phMax, 'increment', setPhMax, phMin, 14)}> + </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <h4>TDS:</h4>
                        <td>
                            <span className='slider-text'>Min:</span> 
                            <input 
                                type="range" 
                                min="0" 
                                max="2000" 
                                value={tdsMin} 
                                step="10" 
                                onChange={(e) => handleSliderChange(e, setTdsMin)} 
                            />
                            <h5 className='slider-value'>{tdsMin} ppm</h5>
                        </td>
                    </tr>
                    <tr>
                        <h4>Water Temperature:</h4>
                        <td>
                            <span>Min:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(waterTempMin, 'decrement', setWaterTempMin, 0, waterTempMax)}> - </button>
                                <input className='input-text' type="text" value={waterTempMin} onChange={(e) => setWaterTempMin(e.target.value)} readOnly/>
                                <button onClick={() => handleChange(waterTempMin, 'increment', setWaterTempMin, 0, waterTempMax)}> + </button>
                            </div>
                            <span>Max:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(waterTempMax, 'decrement', setWaterTempMax, waterTempMin, 24)}> - </button>
                                <input className='input-text' type="text" value={waterTempMax} onChange={(e) => setWaterTempMax(e.target.value)} readOnly/>
                                <button onClick={() => handleChange(waterTempMax, 'increment', setWaterTempMax, waterTempMin, 24)}> + </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <h4>Humidity:</h4>
                        <td>
                            <span className='slider-text'>Offset:</span>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={humidityOffset}
                                onChange={(e) => handleSliderChange(e, setHumidityOffset)}
                            />
                            <h5 className='slider-value'>{humidityOffset}%</h5>
                        </td>
                    </tr>
                    <tr>
                        <h4>Air Temperature:</h4>
                        <td>
                            <span>Min:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(airTempMin, 'decrement', setAirTempMin, 0, airTempMax)}> - </button>
                                <input className='input-text' type="text" value={airTempMin} onChange={(e) => setAirTempMin(e.target.value)} readOnly/>
                                <button onClick={() => handleChange(airTempMin, 'increment', setAirTempMin, 0, airTempMax)}> + </button>
                            </div>
                            <span>Max:</span>
                            <div className="input-container">
                                <button onClick={() => handleChange(airTempMax, 'decrement', setAirTempMax, airTempMin, 30)}> - </button>
                                <input className='input-text' type="text" value={airTempMax} onChange={(e) => setAirTempMax(e.target.value)} readOnly/>
                                <button onClick={() => handleChange(airTempMax, 'increment', setAirTempMax, airTempMin, 30)}> + </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlertsSettingsModal;
