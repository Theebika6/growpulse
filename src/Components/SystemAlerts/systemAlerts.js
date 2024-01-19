import React, { useState, useEffect } from 'react';
import './systemAlerts.css';
import on from '../Images/Dashboard/ON.png';
import off_icon from '../Images/Dashboard/OFF.png';
import { auth, database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { togglePhAlert } from '../Services/AlertsServices'; // Adjust the path as needed

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
        <table className="system-table">
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
              return (
                <tr key={system.systemName}>
                  <td>{system.systemName}</td>
                  <td>
                    <div className='min-max-alerts'>
                        <div>
                            <span className='min-max-style'>Min:</span> {phMin?.toFixed(2) || '-'}
                            <span className='min-max-style'>Max:</span> {phMax?.toFixed(2) || '-'}
                        </div>
                        <button className="toggle-button alerts-buttons" onClick={() => togglePhAlert(phAlert, () => {}, system.systemName)}>
                            <img src={phAlert ? on : off_icon} alt="Toggle" />
                            <span className="auto-label alert-label" style={{ color: phAlert ? '#0096ff' : 'grey' }}>Alert</span>
                        </button>
                    </div>
                  </td>
                  {/* ... other cells */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemAlerts;
