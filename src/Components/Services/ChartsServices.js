import Chart from 'chart.js/auto';
import { auth, firestore } from "../../firebaseConfig";
import {doc, getDoc } from "firebase/firestore";
import moment from 'moment';

export const createPhChart = (context, recentSamples) => {
    if (recentSamples.pH.length > 0) {
        return new Chart(context, {
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
    }
};

export const createTdsChart = (context, recentSamples) => {
    if (recentSamples.TDS.length > 0) {
        return new Chart(context, {
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
    }
};

export const createHumidityChart = (context, recentSamples) => {
    if (recentSamples.Humidity.length > 0) {
        return new Chart(context, {
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
    }
};

export const createTemperatureChart = (context, recentSamples) => {
    if (recentSamples.Temperature.length > 0) {
        return new Chart(context, {
            type: 'line',
            data: {
                labels: [...recentSamples.Times.reverse()],
                datasets: [{
                    label: 'Humidity Samples',
                    data: [...recentSamples.Temperature].reverse(),
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
    }
};

export const fetchLastSevenSamples = async (setRecentSamples, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const sensorHistoryDocRef = doc(firestore, `Registered Users/${currentUser.uid}/${systemName}/SensorHistory`);
  
      const sensorHistorySnapshot = await getDoc(sensorHistoryDocRef);
  
      if (sensorHistorySnapshot.exists()) {
        const sensorHistoryData = sensorHistorySnapshot.data();
        // Convert the object keys (dates) into an array, sort them to find the most recent date
        const dates = Object.keys(sensorHistoryData).sort((a, b) => moment(b).diff(moment(a)));
        const mostRecentDate = dates[0]; // Most recent date
        const timeEntries = sensorHistoryData[mostRecentDate]; // Access the map of time entries for the most recent date
  
        // Convert timeEntries object to an array and sort by time descending to get the last entries
        const sortedTimeEntries = Object.entries(timeEntries)
          .sort(([timeA], [timeB]) => moment(timeB, 'HH:mm:ss').diff(moment(timeA, 'HH:mm:ss')))
          .slice(0, 7); // Get the last 7 samples
  
        const recentSamples = {
          TDS: [],
          pH: [],
          Temperature: [],
          Humidity: [],
          Times: []
        };
  
        sortedTimeEntries.forEach(([time, data]) => {
          recentSamples.TDS.push(data.tdsValue);
          recentSamples.pH.push(data.phValue);
          recentSamples.Temperature.push(data.WaterTemperature);
          recentSamples.Humidity.push(data.Humidity);
          recentSamples.Times.push(moment(time, 'HH:mm:ss').format('HH:mm'));
        });
  
        setRecentSamples(recentSamples);
      } else {
        console.error("The SensorHistory document does not exist.");
      }
    } else {
      console.error("User is not logged in or authenticated.");
    }
  };
  