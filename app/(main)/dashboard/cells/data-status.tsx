import PendingStatusIcon from "@/public/icons/pending-status";
import SuccessStatusIcon from "@/public/icons/success-status";
import React from "react";

const DataStatus = ({ dataStatus }: { dataStatus: 0 | 1 }) => {
  const renderIcon = () => {
    switch (dataStatus) {
      case 0:
        return <PendingStatusIcon />;
      case 1:
        return <SuccessStatusIcon />;
      default:
        return null;
    }
  };

  return <div className="ps-6">{renderIcon()}</div>;
};

export default DataStatus;
