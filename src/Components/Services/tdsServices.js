import { auth, database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { debounce } from "lodash";

export const fetchTdsValue = async (setTdsValue, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const tdsSensorRef = ref(database, `Registered Users/${currentUser.uid}/${systemName}/LiveFeed/tdsValue`);
        onValue(tdsSensorRef, debounce((snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                setTdsValue(value.toFixed(2));
            }
        }, 1000));
    }
};
