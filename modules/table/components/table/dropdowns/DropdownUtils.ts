import {DropdownOption} from "@/modules/table/utils/tableTypes";
import {useFormStore} from "@/modules/form-builder";

export interface DependencyConfig {
    field: string; // The field/column key this dropdown depends on
    method: 'replace' | 'query'; // Method to add value to URL: replace = replace in URL path, query = add as query parameter
    paramName?: string; // The parameter name to use when method is 'query' (defaults to field name)
}

export interface DynamicDropdownConfig {
    url: string;
    valueField: string;
    labelField: string;
    selectAll?: boolean; // Whether to automatically select all options when field is multi-select
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
    dependsOn?: string | DependencyConfig[] | Record<string, { method: 'replace' | 'query', paramName?: string }>
): string | null => {
    if (!isDisabled || !dependsOn) return null;

    // Case 1: String format (backward compatibility)
    if (typeof dependsOn === 'string') {
        return `Please select a ${dependsOn} first`;
    }

    // Case 2: Array of dependency configs
    if (Array.isArray(dependsOn) && dependsOn.length > 0) {
        if (dependsOn.length === 1) {
            return `Please select a ${dependsOn[0].field} first`;
        } else {
            const fields = dependsOn.map(dep => dep.field).join(', ');
            return `Please select the required fields: ${fields}`;
        }
    }

    // Case 3: Object with field names as keys
    if (typeof dependsOn === 'object') {
        const fields = Object.keys(dependsOn);
        if (fields.length === 1) {
            return `Please select a ${fields[0]} first`;
        } else if (fields.length > 1) {
            return `Please select the required fields: ${fields.join(', ')}`;
        }
    }

    return null;
};

export const getFetchUrl = (
    baseUrl: string,
    dynamicConfig: DynamicDropdownConfig,
    dependencies?: Record<string, string | string[]>
): string|null => {
    let url = baseUrl;
    const params = new URLSearchParams();
    if (dynamicConfig.dependsOn) {
        // If dependsOn is provided, we must also have dependencies values.
        if (!dependencies) return null;

        // Case 1: String format (backward compatibility)
        if (typeof dynamicConfig.dependsOn === "string") {
            const field = dynamicConfig.dependsOn;
            const dependencyValue = dependencies[field];
            if (!dependencyValue) return null;

            if (dynamicConfig.filterParam) {
                const paramValue = Array.isArray(dependencyValue)
                    ? dependencyValue.join(",")
                    : dependencyValue;
                params.append(dynamicConfig.filterParam, paramValue);
            }
        }
        // Case 2: Array of dependency configs
        else if (Array.isArray(dynamicConfig.dependsOn)) {
            for (const depConfig of dynamicConfig.dependsOn) {
                const dependencyValue = dependencies[depConfig.field];
                if (!dependencyValue) return null;

                const paramValue = Array.isArray(dependencyValue)
                    ? dependencyValue.join(",")
                    : dependencyValue;

                if (depConfig.method === "replace") {
                    const placeholder = `{${depConfig.field}}`;
                    url = url.replace(placeholder, encodeURIComponent(paramValue));
                } else if (depConfig.method === "query") {
                    const paramName = depConfig.paramName || depConfig.field;
                    params.append(paramName, paramValue);
                }
            }
        }
        // Case 3: Object with field names as keys
        else if (typeof dynamicConfig.dependsOn === "object") {
            for (const [field, config] of Object.entries(dynamicConfig.dependsOn)) {
                const dependencyValue = dependencies[field];
                if (!dependencyValue) return null;

                const paramValue = Array.isArray(dependencyValue)
                    ? dependencyValue.join(",")
                    : dependencyValue;

                if (config.method === "replace") {
                    const placeholder = `{${field}}`;
                    url = url.replace(placeholder, encodeURIComponent(paramValue));
                } else if (config.method === "query") {
                    const paramName = config.paramName || field;
                    params.append(paramName, paramValue);
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

    const extractedOptions = data.map(item => {
        // Handle primitive values (string, number)
        if (typeof item === 'string' || typeof item === 'number') {
            // For primitive values, use the value as both value and label
            return {
                value: String(item),
                label: String(item),
            };
        }

        // Handle array format [value, label]
        if (Array.isArray(item)) {
            // If item is an array, use indices as valueField and labelField
            // For example, if valueField is "0" and labelField is "1", use item[0] as value and item[1] as label
            const valueIndex = parseInt(valueField, 10);
            const labelIndex = parseInt(labelField, 10);

            if (!isNaN(valueIndex) && !isNaN(labelIndex) &&
                valueIndex >= 0 && labelIndex >= 0 &&
                valueIndex < item.length && labelIndex < item.length) {
                return {
                    value: String(item[valueIndex]),
                    label: String(item[labelIndex]),
                };
            }

            // Fallback to first element as value and second as label if indices are invalid
            return {
                value: String(item[0] || ''),
                label: String(item[1] || item[0] || ''),
            };
        }

        // Handle object format
        return {
            value: String(getValue(item, valueField)),
            label: String(getValue(item, labelField)),
        };
    });

    const validOptions = extractedOptions.filter(
        opt => opt.value && opt.value.trim() !== ''
    );

    // Remove duplicates
    return validOptions.reduce((acc: DropdownOption[], current) => {
        const x = acc.find(item => item.value == current.value);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);
};
