import Chart from 'chart.js/auto';
import { auth, firestore } from "../../firebaseConfig";
import {doc, getDoc } from "firebase/firestore";
import moment from 'moment';

export const createPhChart = (phCtx, recentSamples, phChartRef) => {
    
    if (phChartRef.current) {
        phChartRef.current.destroy();
    }

    if (recentSamples.pH.length > 0) {
        phChartRef.current = new Chart(phCtx, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times].reverse(),
                datasets: [{
                    label: 'pH Samples',
                    data: [...recentSamples.pH].reverse(),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                maintainAspectRatio: false, 
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return phChartRef.current;
    } 
};

export const createTdsChart = (tdsCtx, recentSamples, TdsChartRef) => {

    if (TdsChartRef.current) {
        TdsChartRef.current.destroy();
    }

    if (recentSamples.TDS.length > 0) {
        TdsChartRef.current = new Chart(tdsCtx, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times].reverse(),
                datasets: [{
                    label: 'TDS Samples',
                    data: [...recentSamples.TDS].reverse(),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                }]
            },
            options: {
                maintainAspectRatio: false, 
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return TdsChartRef.current;
    } 
};

export const createWaterTemperatureChart = (waterTempCtx, recentSamples, waterTempChartRef) => {
    
    if (waterTempChartRef.current) {
        waterTempChartRef.current.destroy();
    }

    if (recentSamples.WaterTemperature.length > 0) {
        waterTempChartRef.current = new Chart(waterTempCtx, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times.reverse()],
                datasets: [{
                    label: 'Water Temperature Samples',
                    data: [...recentSamples.WaterTemperature].reverse(),
                    borderColor: 'rgba(1, 1, 122, 1)',
                    fill: false,
                    backgroundColor: 'rgba(1, 1, 122, 0.2)',
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return waterTempChartRef.current;
    } 
};

export const createHumidityChart = (humidityCtx, recentSamples, humidityChartRef) => {

    if (humidityChartRef.current) {
        humidityChartRef.current.destroy();
    }

    if (recentSamples.Humidity.length > 0) {
        humidityChartRef.current = new Chart(humidityCtx, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times].reverse(),
                datasets: [{
                    label: 'Humidity Samples',
                    data: [...recentSamples.Humidity].reverse(),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return humidityChartRef.current;
    } 
};

export const createAirTemperatureChart = (airTempCtx, recentSamples, airTempChartRef) => {

    if (airTempChartRef.current) {
        airTempChartRef.current.destroy();
    }

    if (recentSamples.AirTemperature.length > 0) {
        airTempChartRef.current = new Chart(airTempCtx, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times.reverse()],
                datasets: [{
                    label: 'Air Temperature Samples',
                    data: [...recentSamples.AirTemperature].reverse(),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    fill: false,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: true
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return airTempChartRef.current;
    } 
};

export const fetchLastSevenSamples = async (setRecentSamples, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const sensorHistoryRef = doc(firestore, `Registered Users/${currentUser.uid}/${systemName}/SensorHistory`);
  
      const sensorHistorySnapshot = await getDoc(sensorHistoryRef);
  
      if (sensorHistorySnapshot.exists()) {
        const sensorHistoryData = sensorHistorySnapshot.data();
        // Convert the object keys (dates) into an array, sort them to find the most recent date
        const dates = Object.keys(sensorHistoryData).sort((a, b) => moment(b, 'YYYY-MM-DD').diff(moment(a, 'YYYY-MM-DD')));
        const mostRecentDate = dates[0]; // Most recent date
  
        // Check if mostRecentDate exists and has entries
        if (mostRecentDate && sensorHistoryData[mostRecentDate]) {
          const timeEntries = sensorHistoryData[mostRecentDate]; // Access the map of time entries for the most recent date
  
          // Convert timeEntries object to an array and sort by time descending to get the last entries
          const sortedTimeEntries = Object.entries(timeEntries)
            .sort(([timeA], [timeB]) => moment.utc(timeB, 'HH:mm:ss').diff(moment.utc(timeA, 'HH:mm:ss')))
            .slice(0, 7); // Get the last 7 samples
  
          const recentSamples = {
            TDS: [],
            pH: [],
            AirTemperature: [],
            WaterTemperature : [],
            Humidity: [],
            Times: []
          };
  
          sortedTimeEntries.forEach(([time, data]) => {
            recentSamples.TDS.push(data.tdsValue);
            recentSamples.pH.push(data.phValue);
            recentSamples.AirTemperature.push(data.AirTemperature);
            recentSamples.Humidity.push(data.Humidity);
            recentSamples.WaterTemperature.push(data.WaterTemperature);
            recentSamples.Times.push(moment(time, 'HH:mm:ss').format('HH:mm'));
          });
  
          setRecentSamples(recentSamples);
        } else {
          console.error("The most recent date does not have any entries or does not exist.");
        }
      } else {
        console.error("The SensorHistory document does not exist.");
      }
    } else {
      console.error("User is not logged in or authenticated.");
    }
};
  
  