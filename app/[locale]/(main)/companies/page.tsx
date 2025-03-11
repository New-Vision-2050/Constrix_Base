"use client";

import TableBuilder from "@/modules/table/components/TableBuilder";
import { companiesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React from "react";
import {contactFormConfig} from "@/modules/form-builder/configs/contactFormConfig";
import FormBuilderForm from "@/modules/form-builder/FormBuilderForm";

const page = () => {
    const SearchBarActions = () => (
        <FormBuilderForm config={contactFormConfig} onFormSubmit={() => {}} />
    );

    return (
        <div className="px-8">
            <TableBuilder
                config={companiesConfig}
                searchBarActions={<SearchBarActions />}
            />
        </div>
    );
};

export default page;
