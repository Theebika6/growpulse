import React from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import './AllSystems.css';
import '../Common/background.css';
import worldMap from './countries-110m.json'; // Ensure this path correctly points to your JSON file

const AllSystems = ({ sidebarExpanded }) => {
    return (
        <div className={`background-overlay ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className="allSystems">
                <header>
                    <h2 className="Header">Quick view of all of your systems:</h2>
                </header>
                <main className='overview-main'>
                    <div className="map-container">
                        <ComposableMap>
                            <Geographies geography={worldMap}>
                                {({ geographies }) =>
                                    geographies.map(geo => (
                                        <Geography 
                                            key={geo.rsmKey} 
                                            geography={geo}
                                            className="geography"
                                            onClick={(event) => event.preventDefault()}
                                            style={{
                                                default: { fill: "#00000000", stroke: "#888888" },
                                                hover: { fill: "#006effb7" },
                                                pressed: { fill: "#006effb7" }
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>
                    <div className="container current-systems">
                        <h3>Your Current Systems</h3>
                           
                    </div>
                    <div className="container Live-Feed-AllSystems">
                        <h3>Live Feed</h3>
                           
                    </div>
                    <div className="container indiv-costs">
                        <h3>Solution Costs</h3>
                           
                    </div>
                    <div className="container total-costs">
                        <h3>Total Sol. Costs</h3>
                           
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AllSystems;
