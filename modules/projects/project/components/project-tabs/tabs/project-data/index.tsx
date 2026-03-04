"use client";

import React from "react";
import { Search } from "lucide-react";
import ProjectInfoSection from "./project-info";
import ProjectDetailsSection from "./project-details";
import ProjectStatusSection from "./project-status";

export default function ProjectDataTab() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="بحث"
          className="w-full bg-sidebar border border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition"
        />
        <Search className="absolute top-1/2 -translate-y-1/2 end-4 w-4 h-4 text-muted-foreground" />
      </div>

      {/* بيانات المشروع */}
      <ProjectInfoSection />

      {/* تفاصيل المشروع */}
      <ProjectDetailsSection />

      {/* حالة المشروع */}
      <ProjectStatusSection />
    </div>
  );
}
