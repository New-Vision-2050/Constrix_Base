"use client";

import { ContactBannersTable } from "./ContactBannersTable";
import { BranchesTable } from "./BranchesTable";
import { FeaturesTable } from "./FeaturesTable";

function ContactView() {
  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-8xl mx-auto space-y-8">
        <ContactBannersTable />
        <BranchesTable />
        <FeaturesTable />
      </div>
    </div>
  );
}

export default ContactView;
