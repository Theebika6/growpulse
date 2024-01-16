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
                <main>
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
                </main>
            </div>
        </div>
    );
};

export default AllSystems;
