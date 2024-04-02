import { auth, database } from "../../firebaseConfig";
import { ref, get, update } from "firebase/database";

const updateTotalAmounts = async (path, totals) => {
    const refPath = ref(database, path);
    try {
        await update(refPath, totals);
    } catch (error) {
        console.error("Error updating totals: ", error);
    }
};

export const fetchLogHistory = async (setLogHistory, systemName) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const logHistoryPath = `Registered Users/${currentUser.uid}/${systemName}/History/DispenseHistory`;
        const logHistoryRef = ref(database, logHistoryPath);

        try {
            const snapshot = await get(logHistoryRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                let formattedData = [];
                let totals = { totalUp: 0, totalDown: 0, totalA: 0, totalB: 0 };

                for (const [date, timeEntries] of Object.entries(data)) {
                    for (const [time, logData] of Object.entries(timeEntries)) {
                        for (const [type, amount] of Object.entries(logData)) {
                            formattedData.push({
                                rawDate: date,
                                date: formatDate(date),
                                time,
                                Type: typeDisplayMapping[type] || type,
                                Amount: amount
                            });

                            if (type.includes('Up')) {
                                totals.totalUp += amount;
                            } else if (type.includes('Down')) {
                                totals.totalDown += amount;
                            } else if (type.includes('A')) {
                                totals.totalA += amount;
                            } else if (type.includes('B')) {
                                totals.totalB += amount;
                            }
                        }
                    }
                }

                // Sort and remove rawDate as before
                formattedData.sort((a, b) => {
                    const aDateTime = new Date(`${a.rawDate}T${a.time}`);
                    const bDateTime = new Date(`${b.rawDate}T${b.time}`);
                    return bDateTime - aDateTime;
                });
                formattedData = formattedData.map(({ rawDate, ...item }) => item);

                setLogHistory(formattedData);
                await updateTotalAmounts(logHistoryPath, totals);
            } else {
                setLogHistory([]);
            }
        } catch (error) {
            console.error("Error fetching log history:", error);
        }
    }
};

const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

const typeDisplayMapping = {
    DP1: "Manual pH Up",
    dispensedVolumeUpAuto: "Automatic pH Up",
    DP2: "Manual pH Down",
    dispensedVolumeDownAuto: "Automatic pH Down",
    dispensedVolumeA_Init: "Initial Dose Sol. A",
    dispensedVolumeB_Init: "Initial Dose Sol. B",
    DP3: "Manual Dose Sol. A",
    DP4: "Manual Dose Sol. B"
};
