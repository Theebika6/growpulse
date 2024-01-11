import React, { useEffect, useState } from 'react';
import { auth } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebaseConfig';
import {useParams} from "react-router-dom";
import './Overview.css';

const Overview = ({ sidebarExpanded }) => {
    const [imageUrl, setImageUrl] = useState('');
    const { systemName } = useParams();

    useEffect(() => {
        const fetchImage = async () => {
            const currentUser = auth.currentUser;
            if (currentUser){
                const storageRef = ref(storage, `Registered Users/${currentUser.uid}/${systemName}/placeHolder.jpg`);
                try {
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }
        };

        fetchImage();
    }, [systemName]);

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}> {/* css file in src/Components/Common */}
            <div className="overview">
                <header className="header-text">
                    <h2>Here is the overview of your {systemName}:</h2>
                </header>
                <main className="overview-main">
                    <div className="container camera-container">
                        <h3>Camera</h3>
                            {imageUrl ? <img className="camera" src={imageUrl} alt="Camera"/>
                                : <p>Loading image...</p>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;
