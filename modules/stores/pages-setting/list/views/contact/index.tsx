"use client";

import { ContactBannersTable } from "./ContactBannersTable";
import { BranchesTable } from "./BranchesTable";
import { FeaturesTable } from "./FeaturesTable";
import { useState } from "react";

function ContactView() {
  const [showBranches, setShowBranches] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const handleContactLoaded = () => {
    console.log("Contact banners loaded, showing branches");
    setShowBranches(true);
  };

  const handleBranchesLoaded = () => {
    console.log("Branches loaded, showing features");
    setShowFeatures(true);
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-8xl mx-auto space-y-8">
        <ContactBannersTable onLoaded={handleContactLoaded} />
        {showBranches && <BranchesTable onLoaded={handleBranchesLoaded} />}
        {showFeatures && <FeaturesTable />}
      </div>
    </div>
  );
}

export default ContactView;
