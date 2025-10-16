import React from 'react';
// Fix: Added .tsx extension to import path.
import AnalyticsChart from '../components/AnalyticsChart.tsx';

const AnalyticsScreen: React.FC = () => {
    return (
        <div className="p-4 pb-20">
            <AnalyticsChart />
        </div>
    );
};

export default AnalyticsScreen;