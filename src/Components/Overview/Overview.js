import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import { fetchImage} from '../Services/CameraServices';
import './Overview.css';

const Overview = ({ sidebarExpanded }) => {
    const [imageUrl, setImageUrl] = useState('');
    const { systemName } = useParams();

    useEffect(() => {
        const loadImage = async () => {
            const url = await fetchImage(systemName);
            setImageUrl(url); 
        };
        loadImage();
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
                            {imageUrl === null ? (
                                <p className="no-image">No Image Found</p> // Display "No Image Found" when imageUrl is null
                            ) : imageUrl ? (
                                <img className="camera" src={imageUrl} alt="Camera"/>
                            ) : (
                                <p>Loading image...</p>
                            )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;
