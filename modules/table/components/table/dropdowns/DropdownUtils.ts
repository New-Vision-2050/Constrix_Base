import {DropdownOption} from "@/modules/table/utils/tableTypes";

export interface DependencyConfig {
    field: string; // The field/column key this dropdown depends on
    method: 'replace' | 'query'; // Method to add value to URL: replace = replace in URL path, query = add as query parameter
    paramName?: string; // The parameter name to use when method is 'query' (defaults to field name)
}

export interface DynamicDropdownConfig {
    url: string;
    valueField: string;
    labelField: string;
    dependsOn?: string | DependencyConfig[] | Record<string, { method: 'replace' | 'query', paramName?: string }>; // The field/column key this dropdown depends on
    // dependsOn can be:
    // 1. A string (for backward compatibility)
    // 2. An array of DependencyConfig objects
    // 3. An object with field names as keys and configuration as values
    filterParam?: string; // The parameter name to filter by in API calls (used when dependsOn is a string, for backward compatibility)
    searchParam?: string; // Parameter name for search query
    paginationEnabled?: boolean; // Whether to use pagination
    pageParam?: string; // Parameter name for page number
    limitParam?: string; // Parameter name for items per page
    itemsPerPage?: number; // Number of items to fetch per page
    totalCountHeader?: string; // Header containing total count information
    headers?: Record<string, string>; // Custom headers for the API request
    queryParameters?: Record<string, string>; // Additional query parameters
    transformResponse?: (data: any) => DropdownOption[]; // Transform API response to dropdown options
    enableServerSearch?: boolean; // Whether to enable server-side search
}

export interface DropdownBaseProps {
    columnKey: string;
    label: string;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    options?: DropdownOption[];
    dynamicConfig?: DynamicDropdownConfig;
    dependencies?: Record<string, string | string[]>;
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
    dynamicConfig: DynamicDropdownConfig,
    dependencies?: Record<string, string | string[]>
): string => {
    let url = baseUrl;
    const params = new URLSearchParams();

    if (dynamicConfig.dependsOn && dependencies) {
        // Case 1: String format (backward compatibility)
        if (typeof dynamicConfig.dependsOn === 'string') {
            if (dynamicConfig.filterParam && dependencies[dynamicConfig.dependsOn]) {
                const dependencyValue = dependencies[dynamicConfig.dependsOn];
                // Handle both string and string[] values
                const paramValue = Array.isArray(dependencyValue)
                    ? dependencyValue.join(',')
                    : dependencyValue;

                params.append(
                    dynamicConfig.filterParam,
                    paramValue
                );
            }
        }
        // Case 2: Array of dependency configs
        else if (Array.isArray(dynamicConfig.dependsOn)) {
            for (const depConfig of dynamicConfig.dependsOn) {
                if (dependencies[depConfig.field]) {
                    const dependencyValue = dependencies[depConfig.field];
                    const paramValue = Array.isArray(dependencyValue)
                        ? dependencyValue.join(',')
                        : dependencyValue;

                    if (depConfig.method === 'replace') {
                        // Replace placeholders in URL
                        const placeholder = `{${depConfig.field}}`;
                        url = url.replace(placeholder, encodeURIComponent(paramValue));
                    } else if (depConfig.method === 'query') {
                        // Add as query parameter
                        const paramName = depConfig.paramName || depConfig.field;
                        params.append(paramName, paramValue);
                    }
                }
            }
        }
        // Case 3: Object with field names as keys
        else if (typeof dynamicConfig.dependsOn === 'object') {
            for (const [field, config] of Object.entries(dynamicConfig.dependsOn)) {
                if (dependencies[field]) {
                    const dependencyValue = dependencies[field];
                    const paramValue = Array.isArray(dependencyValue)
                        ? dependencyValue.join(',')
                        : dependencyValue;

                    if (config.method === 'replace') {
                        // Replace placeholders in URL
                        const placeholder = `{${field}}`;
                        url = url.replace(placeholder, encodeURIComponent(paramValue));
                    } else if (config.method === 'query') {
                        // Add as query parameter
                        const paramName = config.paramName || field;
                        params.append(paramName, paramValue);
                    }
                }
            }
        }
    }

    // Append params to URL
    const queryString = params.toString();
    if (queryString) {
        url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
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
