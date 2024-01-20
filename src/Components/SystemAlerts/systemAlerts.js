import React, { useState, useEffect } from 'react';
import './systemAlerts.css';
import on from '../Images/Dashboard/ON.png';
import off_icon from '../Images/Dashboard/OFF.png';
import { auth, database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {
  toggleAirTempAlert, toggleCamAlert, toggleDpAlert,
  toggleHumidityAlert,
  togglePhAlert,
  toggleTdsAlert,
  toggleWaterTempAlert
} from '../Services/AlertsServices';
import scroll from '../Images/HeaderIcons/scroll-grey.png'

const SystemAlerts = ({ sidebarExpanded }) => {
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    const fetchSystems = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const systemsRef = ref(database, `Registered Users/${currentUser.uid}`);
        onValue(systemsRef, (snapshot) => {
          const systemsData = [];
          snapshot.forEach((childSnapshot) => {
            // Check if the key includes 'System'
            if (childSnapshot.key.includes('System')) {
              const systemName = childSnapshot.key;
              const alerts = childSnapshot.val().Alerts || {}; // Provide a default empty object
              systemsData.push({
                systemName,
                alerts
              });
            }
          });
          setSystems(systemsData);
        });
      }
    };

    fetchSystems();
  }, []);

  // Function to safely access nested properties
  const safelyGetNestedProperty = (object, ...keys) => {
    return keys.reduce((obj, key) => (obj && obj[key] != null) ? obj[key] : null, object);
  };

  return (
    <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <div className="system-alerts">
        <table className="system-table alerts-table">
          <thead>
            <tr>
            <th>System</th>
              <th>pH</th>
              <th>TDS</th>
              <th>Water Temp.</th>
              <th>Humidity</th>
              <th>Air Temp.</th>
              <th>Dosing Pumps</th>
              <th>CAM</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system) => {
              const phMin = safelyGetNestedProperty(system, 'alerts', 'pH', 'phMin');
              const phMax = safelyGetNestedProperty(system, 'alerts', 'pH', 'phMax');
              const phAlert = safelyGetNestedProperty(system, 'alerts', 'pH', 'phAlert');

              const tdsMin = safelyGetNestedProperty(system, 'alerts', 'TDS', 'tdsMin');
              const tdsAlert = safelyGetNestedProperty(system, 'alerts', 'TDS', 'tdsAlert');

              const waterTempMin = safelyGetNestedProperty(system, 'alerts', 'WaterTemperature', 'waterTempMin');
              const waterTempMax = safelyGetNestedProperty(system, 'alerts', 'WaterTemperature', 'waterTempMax');
              const waterTempAlert = safelyGetNestedProperty(system, 'alerts', 'WaterTemperature', 'waterTempAlert');

              const humidityOffset = safelyGetNestedProperty(system, 'alerts', 'Humidity', 'humidityOffset');
              const humidityAlert = safelyGetNestedProperty(system, 'alerts', 'Humidity', 'humidityAlert');

              const airTempMin = safelyGetNestedProperty(system, 'alerts', 'AirTemperature', 'airTempMin');
              const airTempMax = safelyGetNestedProperty(system, 'alerts', 'AirTemperature', 'airTempMax');
              const airTempAlert = safelyGetNestedProperty(system, 'alerts', 'AirTemperature', 'airTempAlert');

              const pumpsAlert = safelyGetNestedProperty(system, 'alerts', 'DP', 'dpAlert');

              const camAlert = safelyGetNestedProperty(system, 'alerts', 'CAM', 'camAlert');


              return (
                <tr key={system.systemName}>
                  <td>{system.systemName}</td>
                  <td>
                    <div className='min-max-alerts'>
                        <div className='thresholds-alerts'>
                            <span className='min-max-style'>Min:</span> {phMin?.toFixed(2) || '-'}
                            <span className='min-max-style'>Max:</span> {phMax?.toFixed(2) || '-'}
                        </div>
                        <button className="toggle-button alerts-buttons" onClick={() => togglePhAlert(phAlert, () => {}, system.systemName)}>
                            <img src={phAlert ? on : off_icon} alt="Toggle" />
                            <span className="auto-label alert-label" style={{ color: phAlert ? '#0096ff' : 'grey' }}>Alert</span>
                        </button>
                    </div>
                  </td>
                  {/*TDS*/}
                  <td>
                    <div className='min-max-alerts'>
                      <div className='thresholds-alerts'>
                        <span className='min-max-style'>Min:</span> {tdsMin ? `${tdsMin.toFixed(2)} ppm` : '-'}
                      </div>
                      <button className="toggle-button alerts-buttons" onClick={() => toggleTdsAlert(tdsAlert, () => {}, system.systemName)}>
                        <img src={tdsAlert ? on : off_icon} alt="Toggle" />
                        <span className="auto-label alert-label" style={{ color: tdsAlert ? '#0096ff' : 'grey' }}>Alert</span>
                      </button>
                    </div>
                  </td>

                  {/*Water Temp*/}
                  <td>
                    <div className='min-max-alerts'>
                      < div className='thresholds-alerts'>
                            <span className='min-max-style'>Min:</span> {waterTempMin ? `${waterTempMin.toFixed(2)} °C` : '-'}
                            <span className='min-max-style'>Max:</span> {waterTempMax ? `${waterTempMax.toFixed(2)} °C` : '-'}
                        </div>
                        <button className="toggle-button alerts-buttons" onClick={() => toggleWaterTempAlert(waterTempAlert, () => {}, system.systemName)}>
                            <img src={waterTempAlert ? on : off_icon} alt="Toggle" />
                            <span className="auto-label alert-label" style={{ color: waterTempAlert ? '#0096ff' : 'grey' }}>Alert</span>
                        </button>
                    </div>
                  </td>

                  {/*Humidity*/}
                  <td>
                    <div className='min-max-alerts'>
                      <div className='thresholds-alerts'>
                      <span className='min-max-style'>Offset:</span> {humidityOffset ? `${humidityOffset.toFixed(2)}%` : '-'}
                      </div>
                      <button className="toggle-button alerts-buttons" onClick={() => toggleHumidityAlert(humidityAlert, () => {}, system.systemName)}>
                        <img src={humidityAlert ? on : off_icon} alt="Toggle" />
                        <span className="auto-label alert-label" style={{ color: humidityAlert ? '#0096ff' : 'grey' }}>Alert</span>
                      </button>
                    </div>
                  </td>

                  {/*Air Temp*/}
                  <td>
                    <div className='min-max-alerts'>
                      <div className='thresholds-alerts'>
                        <span className='min-max-style'>Min:</span> {airTempMin ? `${airTempMin.toFixed(2)} °C` : '-'}
                        <span className='min-max-style'>Max:</span> {airTempMax ? `${airTempMax.toFixed(2)} °C` : '-'}
                      </div>
                      <button className="toggle-button alerts-buttons" onClick={() => toggleAirTempAlert(airTempAlert, () => {}, system.systemName)}>
                        <img src={airTempAlert ? on : off_icon} alt="Toggle" />
                        <span className="auto-label alert-label" style={{ color: airTempAlert ? '#0096ff' : 'grey' }}>Alert</span>
                      </button>
                    </div>
                  </td>

                  {/*Dosing Pumps*/}
                  <td>
                    <div className='min-max-alerts'>
                      <div>
                        <span className='min-max-style'>Malfunction Alert:</span>
                      </div>
                      <button className="toggle-button alerts-buttons" onClick={() => toggleDpAlert(pumpsAlert, () => {}, system.systemName)}>
                        <img src={pumpsAlert ? on : off_icon} alt="Toggle" />
                        <span className="auto-label alert-label" style={{ color: pumpsAlert ? '#0096ff' : 'grey' }}>Alert</span>
                      </button>
                    </div>
                  </td>

                  {/*CAM*/}
                  <td>
                    <div className='min-max-alerts'>
                      <div>
                        <span className='min-max-style'>Malfunction Alert:</span>
                      </div>
                      <button className="toggle-button alerts-buttons" onClick={() => toggleCamAlert(camAlert, () => {}, system.systemName)}>
                        <img src={camAlert ? on : off_icon} alt="Toggle" />
                        <span className="auto-label alert-label" style={{ color: camAlert ? '#0096ff' : 'grey' }}>Alert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="scroll-indicator">
          <span>Scroll for more</span>
          <div>
            <img src={scroll} alt="Scroll" className='scroll'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAlerts;
