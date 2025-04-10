import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';

const MobileMenuToggle = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);  // Toggle sidebar open state
    };

    return (
        <>
            <button type="button" className="sidebar-mobile-toggle" onClick={toggleSidebar}>
                <Icon icon="heroicons:bars-3-solid" className="icon"></Icon>
            </button>

            <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
<<<<<<< HEAD
                {/* Sidebar content */}
            </div>

            <div className={isSidebarOpen ? 'overlay-active' : ''}>
                {/* Your overlay content */}
=======
            </div>

            <div className={isSidebarOpen ? 'overlay-active' : ''}>
>>>>>>> origin/Sayyyf
            </div>
        </>
    );
};

export default MobileMenuToggle;
