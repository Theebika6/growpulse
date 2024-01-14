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

