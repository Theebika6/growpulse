import { auth, database } from "../../firebaseConfig";
import { ref, onValue, set, get } from "firebase/database";
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';

HighchartsGantt(Highcharts);

export const fetchLightTimes = (setLightStart, setLightEnd, setLightScheduleAuto, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const lightStartRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/lightON`);
        const lightEndRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/lightOFF`);
        const lightScheduleAutoRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/LightAuto`);

        const unsubscribeStart = onValue(lightStartRef, (snapshot) => {
            const startTimeValue = snapshot.val();
            if (startTimeValue) setLightStart(startTimeValue);
        });

        const unsubscribeEnd = onValue(lightEndRef, (snapshot) => {
            const endTimeValue = snapshot.val();
            if (endTimeValue) setLightEnd(endTimeValue);
        });

        const unsubscribeAuto = onValue(lightScheduleAutoRef, (snapshot) => {
            const scheduleAutoValue = snapshot.val();
            setLightScheduleAuto(scheduleAutoValue);
        });

        // Return a cleanup function
        return () => {
            unsubscribeStart();
            unsubscribeEnd();
            unsubscribeAuto();
        };
    }
};

export const updateLightStart = (newTime, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const lightStartRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/lightON`);
        set(lightStartRef, newTime);
    }
};

export const updateLightEnd = (newTime, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const lightEndRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/lightOFF`);
        set(lightEndRef, newTime);
    }
};

export const toggleLightScheduleAuto = (currentState, setLightScheduleAuto, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const lightScheduleAutoRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/LightAuto`);
        const newState = !currentState;
        set(lightScheduleAutoRef, newState);
        setLightScheduleAuto(newState);
    }
};

function timeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':');
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

export const calculateDayNightDurations = (lightStart, lightEnd) => {
    const totalMinutesInDay = 24 * 60;

    const startMinutes = timeToMinutes(lightStart);
    const endMinutes = timeToMinutes(lightEnd);

    let dayDuration, nightDuration;
    if (startMinutes < endMinutes) {
        // Day starts in the morning and ends in the evening
        dayDuration = endMinutes - startMinutes;
        nightDuration = totalMinutesInDay - dayDuration;
    } else {
        // Day starts in the evening and ends in the morning (overnight)
        nightDuration = startMinutes - endMinutes;
        dayDuration = totalMinutesInDay - nightDuration;
    }

    return {
        dayDuration,   // Duration of daylight in minutes
        nightDuration  // Duration of nighttime in minutes
    };
};

// Toggle light power
export const handleToggleLight = async (systemName) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
        const lightControlRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/LightPower`);
        const snapshot = await get(lightControlRef);
        const currentStatus = snapshot.val();
        await set(lightControlRef, !currentStatus); // Toggle the current status
    }
};

// Fetch current light power status
export const fetchLigthPowerStatus = (setLightPowerOn, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const lightPowerStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LightControl/LightPower`);
        const unsubscribe = onValue(lightPowerStatusRef, (snapshot) => {
            const value = snapshot.val();
            setLightPowerOn(value !== null ? value : false); // Update the state based on the value from the database
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

export const createLightScheduleGanttChart = (containerId, lightON, lightOFF) => {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    Highcharts.ganttChart(containerId, {
        chart: {
            backgroundColor: null,
            type: 'gantt',
            marginTop: 0, // Space at the top
            marginRight: 0, // Space on the right
            marginBottom: 20, // Space at the bottom
            marginLeft: 0, // Space on the left
            spacing: [0, 0, 0, 0] // Spacing between the outer edge of the chart and the plot area
        },
        title: {
            text: ''
        },
        xAxis: [{
            visible: true,
            type: 'datetime',
            plotLines: [{
                color: 'red',
                width: 2,
                value: Date.UTC(2024, 0, 1, currentHours, currentMinutes),
                zIndex: 5
            }],
            labels: {
                enabled: false
            },
            tickLength: 0,
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickColor: 'transparent'
        }],
        yAxis: {
            visible: true,
            gridLineWidth: 0,
            labels: {
                enabled: false
            }
        },
        series: [{
            name: 'Light Schedule',
            data: [{
                start: Date.UTC(2024, 0, 1, parseInt(lightON.split(':')[0]), parseInt(lightON.split(':')[1])),
                end: Date.UTC(2024, 0, 1, parseInt(lightOFF.split(':')[0]), parseInt(lightOFF.split(':')[1])),
                name: 'Day',
                color: '#00a9cf'
            }, {
                start: Date.UTC(2024, 0, 1, parseInt(lightOFF.split(':')[0]), parseInt(lightOFF.split(':')[1])),
                end: Date.UTC(2024, 0, 2, parseInt(lightON.split(':')[0]), parseInt(lightON.split(':')[1])),
                name: 'Night',
                color: '#024554'
            }],
            dataLabels: {
                enabled: false
            }
        }],
        tooltip: {
            formatter: function () {
                const start = Highcharts.dateFormat('%H:%M', this.point.options.start);
                const end = Highcharts.dateFormat('%H:%M', this.point.options.end);
                const seriesName = this.point.y === 0 ? 'Day' : 'Night';
                return `<b>${seriesName}</b><br/>Start: ${start}<br/>End: ${end}`;
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderRadius: 5,
                pointPadding: 0.1,
                groupPadding: 0,
                // Additional properties to remove borders
                borderColor: 'transparent', // Ensure no border color
                edgeColor: 'transparent', // Ensures no edge color
                borderWidth: 0 // Ensures no border width
            }
        },
        plotBackgroundImage: '',
        plotBorderColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false
    });
};




