"use client";

import React from "react";
import { Container } from "@mui/material";
import ServicesDropdownDemo from "@/components/shared/ServicesDropdownDemo";

const ServicesDropdownTestPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ServicesDropdownDemo />
    </Container>
  );
};

export default ServicesDropdownTestPage;
