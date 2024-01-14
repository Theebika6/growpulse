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
                labels: [...recentSamples.Times],
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
                labels: [...recentSamples.Times],
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
            if (mostRecentDate && sensorHistoryData[mostRecentDate] && sensorHistoryData[mostRecentDate].DailyAverage) {
                // Ignore the DailyAverage map
                delete sensorHistoryData[mostRecentDate].DailyAverage;
            }

            if (mostRecentDate && sensorHistoryData[mostRecentDate]) {
                // Access the map of time entries for the most recent date
                const timeEntries = sensorHistoryData[mostRecentDate];

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

/* Daily Averages */

export const fetchDayAverages = async (setDayAverages, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const sensorHistoryRef = doc(firestore, `Registered Users/${currentUser.uid}/${systemName}/SensorHistory`);
        
        try {
            const sensorHistorySnapshot = await getDoc(sensorHistoryRef);
            if (sensorHistorySnapshot.exists()) {
                const sensorHistoryData = sensorHistorySnapshot.data();
                // Sort the entries by date and take the last three
                const formattedData = Object.entries(sensorHistoryData)
                    .filter(([date, value]) => value.DailyAverage) 
                    .sort(([dateA], [dateB]) => moment(dateB, "YYYY-MM-DD").diff(moment(dateA, "YYYY-MM-DD")))
                    .slice(0, 3)
                    .map(([date, value]) => {
                        return {
                            date,
                            ...value.DailyAverage,
                        };
                    });
                setDayAverages(formattedData);
            } else {
                console.error("SensorHistory document does not exist.");
            }
        } catch (error) {
            console.error("Error fetching sensor history:", error);
        }
    } else {
        console.error("User is not logged in or authenticated.");
    }
};

export const getChartData = (dayAverages) => {
    const sortedDayAverages = dayAverages.sort((a, b) => 
        moment(a.date, "YYYY-MM-DD").diff(moment(b.date, "YYYY-MM-DD"))
    );

    // Now map the sorted dates to labels, showing only the month and day
    const chartLabels = sortedDayAverages.map((avg) => moment(avg.date).format("MMM D"));
    const chartData = dayAverages.map((avg) => [avg.tdsValue, avg.phValue, avg.AirTemperature, avg.Humidity, avg.WaterTemperature]);

    return {
        labels: chartLabels,
        datasets: [
            {
                label: 'TDS',
                data: chartData.map((data) => data[0]),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-tds',
            },
            {
                label: 'pH',
                data: chartData.map((data) => data[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Temperature',
                data: chartData.map((data) => data[2]),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'Humidity',
                data: chartData.map((data) => data[3]),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Water Temperature',
                data: chartData.map((data) => data[4]),
                backgroundColor: 'rgba(1, 1, 122, 0.3)',
                borderColor: 'rgba(1, 1, 122, 1)',
                borderWidth: 1,
            },
        ],
    };
};

/* Sensor History */
export const fetchLiveData = async (setLiveData, selectedDay, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const liveDataDocRef = doc(firestore, `Registered Users/${currentUser.uid}/${systemName}/SensorHistory`);

        try {
            const liveDataSnapshot = await getDoc(liveDataDocRef);
            if (liveDataSnapshot.exists()) {
                const data = liveDataSnapshot.data()[selectedDay];
                if (data) {
                    // Convert the object to an array and filter out the 'DailyAverage' key if it exists
                    const formattedData = Object.entries(data)
                        .filter(([time, _]) => time !== 'DailyAverage')
                        .map(([time, sensorData]) => ({
                            date: selectedDay,
                            time,
                            ...sensorData,
                        }));

                    setLiveData(formattedData);
                } else {
                    console.error("No data found for the selected day.");
                }
            } else {
                console.error("No such document in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching live data:", error);
        }
    } else {
        console.error("User is not logged in or authenticated.");
    }
};


export const getSelectedDayData = (selectedDay, liveData) => {
    return liveData.filter((data) => data.date === selectedDay);
};

export const getDailyChartData = (selectedDay, liveData) => {
    const filteredData = getSelectedDayData(selectedDay, liveData);
    const chartLabels = filteredData.map((data) => moment(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm').toDate());
    const chartData = filteredData.map((data) => [data.tdsValue, data.phValue, data.AirTemperature, data.AirHumidity, data.WaterTemperature]);

    return {
        labels: chartLabels,
        datasets: [
            {
                label: 'TDS',
                data: chartData.map((data) => data[0]),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
                yAxisID: 'y-axis-tds',
            },
            {
                label: 'pH',
                data: chartData.map((data) => data[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
            },
            {
                label: 'Air Temperature',
                data: chartData.map((data) => data[2]),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
            },
            {
                label: 'Humidity',
                data: chartData.map((data) => data[3]),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
            },
            {
                label: 'Water Temperature',
                data: chartData.map((data) => data[4]),
                backgroundColor: 'rgba(1, 1, 122, 0.3)',
                borderColor: 'rgba(1, 1, 122, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0,
            },
        ],
    };
};