import { auth, database } from "../../firebaseConfig";
import { ref, onValue, set, get } from "firebase/database";
import { debounce } from "lodash";

export const handleTogglePump = async (pump, systemName) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
        const pumpRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/DosingPumps/${pump}`);
        const snapshot = await get(pumpRef);
        const currentStatus = snapshot.val();
        await set(pumpRef, !currentStatus);
    }
};

export const fetchDP1Status = async (setDP1Status, setDataLoaded, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DP1StatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/DosingPumps/DP1`);
        onValue(DP1StatusRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setDP1Status(value ? 1 : 0);
                setDataLoaded(true);
            }
        }, 0));
    }
};

export const fetchDP2Status = async (setDP2Status, setDataLoaded, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DP2StatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/DosingPumps/DP2`);
        onValue(DP2StatusRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setDP2Status(value ? 1 : 0);
                setDataLoaded(true);
            }
        }, 0));
    }
};

export const fetchDP3Status = async (setDP3Status, setDataLoaded, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DP3StatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/DosingPumps/DP3`);
        onValue(DP3StatusRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setDP3Status(value ? 1 : 0);
                setDataLoaded(true);
            }
        }, 0));
    }
};

export const fetchDP4Status = async (setDP4Status, setDataLoaded, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const DP4StatusRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/DosingPumps/DP4`);
        onValue(DP4StatusRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setDP4Status(value ? 1 : 0);
                setDataLoaded(true);
            }
        }, 0));
    }
};
