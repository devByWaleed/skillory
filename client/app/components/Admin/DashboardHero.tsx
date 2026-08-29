import React from "react";
import DashboardWidgets from "./Widgets/DashboardWidgets";


type Props = {
    isDashboard?: boolean;
};

const DashboardHero = ({ isDashboard }: Props) => {
    return (
        <div className="w-full">
            {isDashboard && <DashboardWidgets />}
        </div>
    );
};

export default DashboardHero;