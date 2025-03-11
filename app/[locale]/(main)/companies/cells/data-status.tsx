import React from "react";

const DataStatus = ({ dataStatus }: { dataStatus: 0 | 1 }) => {
  const renderIcon = () => {
    switch (dataStatus) {
      case 0:
        return 'pending';
      case 1:
        return 'success';
      default:
        return null;
    }
  };

  return <div className="ps-6">{renderIcon()}</div>;
};

export default DataStatus;
