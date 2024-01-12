import React, { useEffect, useState,  useRef, useCallback } from 'react';
import {useParams} from "react-router-dom";
import { fetchImage} from '../Services/CameraServices';
import {fetchPhAutoStatus, fetchPhValue} from "../Services/phServices";
import * as pumpService from "../Services/DosingPumpsServices";
import './Overview.css';

const Overview = ({ sidebarExpanded }) => {
    const {systemName } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    
    const [flashUpdate, setFlashUpdate] = useState(false);

    const [phValue, setPhValue] = useState(null);
    const [phAuto, setPhAuto] = useState(false);
    const [dp1Status, setDP1Status] = useState(false);
    const [dp2Status, setDP2Status] = useState(false); 
    const phChartRef = useRef(null);

    /* Camera */
    /* Image Fetching */
    const loadImage = useCallback(async () => {
        const url = await fetchImage(systemName);
        setImageUrl(url); 
    }, [systemName]);

    /* pH */
    /* Live Feed Fetching */
    useEffect(() => {
        setPhValue(0);

        fetchPhValue((newPhValue) => {
            setFlashUpdate(true);

            setTimeout(() => {
                setFlashUpdate(false);
            }, 1000);

            setPhValue(newPhValue);
        }, systemName);

        fetchPhAutoStatus(setPhAuto, systemName);
    }, [systemName]);

    /* Button State Fetching */ 
    const initializeDosingPumpsStatus = useCallback(() => {
        pumpService.fetchDP1Status(setDP1Status, () => {}, systemName);
        pumpService.fetchDP2Status(setDP2Status, () => {}, systemName);
    }, [systemName]);


    /* Common Fetches */
    useEffect(() => {
        loadImage();
        initializeDosingPumpsStatus();
    }, [loadImage, initializeDosingPumpsStatus]);

    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}> {/* css file in src/Components/Common */}
            <div className="overview">
                <header className="header-text">
                    <h2>Here is the overview of your {systemName}:</h2>
                </header>
                <main className="overview-main">

                    {/*Camera*/}
                    <div className="container camera-container">
                        <h3>Camera</h3>
                            {imageUrl === null ? (
                                <p className="no-image">No Image Found</p>
                            ) : imageUrl ? (
                                <img className="camera" src={imageUrl} alt="Camera"/>
                            ) : (
                                <p>Loading image...</p>
                            )}
                    </div>

                    {/*pH*/}
                    <div className="container ph-container">
                        <h3>pH</h3>
                        <div className="control">
                            <div>
                                <p className={flashUpdate ? 'flash-animation' : ''}>{phValue}</p>
                            </div>
                            <div className="control auto">
                                <div className="control buttons">
                                    <button
                                        className={`arrow-button ${dp1Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP1', systemName)}
                                    >
                                        &#9650;
                                    </button>
                                    <button
                                        className={`arrow-button ${dp2Status ? 'active' : ''}`}
                                        onClick={() => pumpService.handleTogglePump('DP2', systemName)}
                                    >
                                        &#9660;
                                    </button>
                                </div>
                                <h5 style={phAuto ? { color: '#52e000', fontSize: '16px' } : {}} >Auto</h5>
                            </div>
                        </div>
                        <div className="chart">
                            <canvas id="phChart"></canvas>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Overview;
