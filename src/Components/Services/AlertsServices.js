import { auth, database } from "../../firebaseConfig";
import { ref, onValue, set} from "firebase/database";
import { debounce } from "lodash";

/*TDS*/

export const fetchTdsMin = async (setTdsMin, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const tdsMinRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/TDS/tdsMin`);
        onValue(tdsMinRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setTdsMin(value.toFixed(2));
            }
        }, 1000));
    }
};

export const toggleTdsAlert = (tdsAlert, setTdsAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const tdsAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/TDS/tdsAlert`);
        set(tdsAlertRef, !tdsAlert).then(() => {
            setTdsAlert(!tdsAlert);
        }).catch((error) => {
            console.error('Error updating tds alert Errror:', error);
        });
    }
};

export const fetchTdsAlert = (setTdsAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const tdsAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/TDS/tdsAlert`);
        const unsubscribe = onValue(tdsAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setTdsAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

/*pH*/

export const fetchPhMin = async (setPhMin, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const phMinRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/pH/phMin`);
        onValue(phMinRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setPhMin(value.toFixed(2));
            }
        }, 1000));
    }
};

export const fetchPhMax = async (setPhMax, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const phMaxRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/pH/phMax`);
        onValue(phMaxRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setPhMax(value.toFixed(2));
            }
        }, 1000));
    }
};

export const togglePhAlert = (phAlert, setPhAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const phAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/pH/phAlert`);
        set(phAlertRef, !phAlert).then(() => {
            setPhAlert(!phAlert);
        }).catch((error) => {
            console.error('Error updating ph alert Errror:', error);
        });
    }
};

export const fetchPhAlert = (setPhAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const phAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/pH/phAlert`);
        const unsubscribe = onValue(phAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setPhAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

/*Water Temperature*/

export const fetchWaterTempMin = async (setWaterTempMin, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const WaterTempMinRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/WaterTemperature/waterTempMin`);
        onValue(WaterTempMinRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setWaterTempMin(value.toFixed(2));
            }
        }, 1000));
    }
};

export const fetchWaterTempMax = async (setWaterTempMax, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const WaterTempMaxRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/WaterTemperature/waterTempMax`);
        onValue(WaterTempMaxRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setWaterTempMax(value.toFixed(2));
            }
        }, 1000));
    }
};

export const toggleWaterTempAlert = (WaterTempAlert, setWaterTempAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const WaterTempAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/WaterTemperature/waterTempAlert`);
        set(WaterTempAlertRef, !WaterTempAlert).then(() => {
            setWaterTempAlert(!WaterTempAlert);
        }).catch((error) => {
            console.error('Error updating water temp alert Errror:', error);
        });
    }
};

export const fetchWaterTempAlert = (setWaterTempAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const waterTempAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/WaterTemperature/waterTempAlert`);
        const unsubscribe = onValue(waterTempAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setWaterTempAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

/*Air Temperature*/

export const fetchAirTempMin = async (setAirTempMin, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const WaterAirMinRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/AirTemperature/airTempMin`);
        onValue(WaterAirMinRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setAirTempMin(value.toFixed(2));
            }
        }, 1000));
    }
};

export const fetchAirTempMax = async (setAirTempMax, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const AirTempMaxRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/AirTemperature/airTempMax`);
        onValue(AirTempMaxRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setAirTempMax(value.toFixed(2));
            }
        }, 1000));
    }
};

export const toggleAirTempAlert = (AirTempAlert, setAirTempAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const AirTempAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/AirTemperature/airTempAlert`);
        set(AirTempAlertRef, !AirTempAlert).then(() => {
            setAirTempAlert(!AirTempAlert);
        }).catch((error) => {
            console.error('Error updating air temp alert Errror:', error);
        });
    }
};

export const fetchAirTempAlert = (setAirTempAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const AirTempAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/AirTemperature/airTempAlert`);
        const unsubscribe = onValue(AirTempAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setAirTempAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};


/*Humidity*/

export const fetchHumidityOffset = async (setHumidityOffset, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const HumidityOffsetRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/Humidity/humidityOffset`);
        onValue(HumidityOffsetRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setHumidityOffset(value.toFixed(2));
            }
        }, 1000));
    }
};

export const toggleHumidityAlert = (HumidityAlert, setHumidityAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const HumidityAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/Humidity/humidityAlert`);
        set(HumidityAlertRef, !HumidityAlert).then(() => {
            setHumidityAlert(!HumidityAlert);
        }).catch((error) => {
            console.error('Error updating Humidity alert Errror:', error);
        });
    }
};

export const fetchHumidityAlert = (setHumidityAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const HumidityAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/Humidity/humidityAlert`);
        const unsubscribe = onValue(HumidityAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setHumidityAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

/*Dosing Pumps*/

export const toggleDpAlert = (DpAlert, setDpAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DpAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/DP/dpAlert`);
        set(DpAlertRef, !DpAlert).then(() => {
            setDpAlert(!DpAlert);
        }).catch((error) => {
            console.error('Error updating Dosing Pumps alert Errror:', error);
        });
    }
};

export const fetchDpAlert = (setDpAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DpAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/DP/dpAlert`);
        const unsubscribe = onValue(DpAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setDpAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};

/*CAM*/

export const toggleCamAlert = (CamAlert, setCamAlert, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const CamAlertRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/CAM/camAlert`);
        set(CamAlertRef, !CamAlert).then(() => {
            setCamAlert(!CamAlert);
        }).catch((error) => {
            console.error('Error updating CAM alert Errror:', error);
        });
    }
};

export const fetchCamAlert = (setCamAlertStatus, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const CamAlertStatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/Alerts/CAM/camAlert`);
        const unsubscribe = onValue(CamAlertStatusRef, (snapshot) => {
            const value = snapshot.val();
            setCamAlertStatus(value !== null ? value : false);
        });

        // Return a cleanup function
        return () => unsubscribe();
    } else {
        // If no user, return a no-op cleanup function
        return () => {};
    }
};