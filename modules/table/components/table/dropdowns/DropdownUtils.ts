import {DropdownOption} from "@/modules/table/utils/tableTypes";

export interface DynamicDropdownConfig {
    url: string;
    valueField: string;
    labelField: string;
    dependsOn?: string;
    filterParam?: string;
    searchParam?: string;
    paginationEnabled?: boolean;
    pageParam?: string;
    limitParam?: string;
    itemsPerPage?: number;
    totalCountHeader?: string;
}

export interface DropdownBaseProps {
    columnKey: string;
    label: string;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    options?: DropdownOption[];
    dynamicConfig?: DynamicDropdownConfig;
    dependencies?: Record<string, string>;
    placeholder?: string;
    isDisabled?: boolean;
    isMulti?: boolean;
}

export const useDependencyMessage = (
    isDisabled: boolean,
    dependsOnField?: string
): string | null => {
    if (isDisabled && dependsOnField) {
        return `Please select a ${dependsOnField} first`;
    }
    return null;
};

export const getFetchUrl = (
    baseUrl: string,
    filterParam?: string,
    dependsOnKey?: string,
    dependencies?: Record<string, string>
): string => {
    let url = baseUrl;

    if (filterParam && dependencies && dependsOnKey) {
        const filterValue = dependencies[dependsOnKey];
        if (filterValue) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}${filterParam}=${encodeURIComponent(filterValue)}`;
        }
    }

    return url;
};

export const extractDropdownOptions = (
    data: any[],
    valueField: string,
    labelField: string
): DropdownOption[] => {
    const getValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const extractedOptions = data.map(item => ({
        value: String(getValue(item, valueField)),
        label: String(getValue(item, labelField)),
    }));

    const validOptions = extractedOptions.filter(
        opt => opt.value && opt.value.trim() !== ''
    );

    // Remove duplicates
    return validOptions.reduce((acc: DropdownOption[], current) => {
        const x = acc.find(item => item.value === current.value);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);
};
