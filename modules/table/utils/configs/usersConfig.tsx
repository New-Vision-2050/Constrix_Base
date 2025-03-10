
import { TableConfig } from './tableConfig';

export const usersConfig: TableConfig = {
  url: 'https://jsonplaceholder.typicode.com/users',
  columns: [
    { key: 'id', label: 'ID', sortable: true, searchable: false },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      searchable: true
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      searchable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      searchable: true
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      searchable: true
    },
    {
      key: 'website',
      label: 'Website',
      sortable: true,
      searchable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      searchable: true,
      searchType: {
        type: 'dropdown',
        placeholder: 'Select status',
        dropdownOptions: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' }
        ]
      }
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      searchable: true,
        searchType: {
            type: 'dropdown',
            placeholder: 'Select Country',
            dynamicDropdown: {
                url: 'https://jsonplaceholder.typicode.com/users',
                valueField: 'id',
                labelField: 'name',
                paginationEnabled: true,
                itemsPerPage: 5,
                searchParam: 'q',
                pageParam: '_page',
                limitParam: '_limit',
                totalCountHeader: 'x-total-count'
            }
        }
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      searchable: true,
      searchType: {
        type: 'dropdown',
        placeholder: 'Select city',
        dynamicDropdown: {
          url: 'https://jsonplaceholder.typicode.com/users',
          valueField: 'address.city',
          labelField: 'address.city',
          dependsOn: 'country',
          filterParam: 'country'
        }
      }
    }
  ],
  defaultSortColumn: 'id',
  defaultSortDirection: 'asc',
  enableSorting: true,
  enablePagination: true,
  defaultItemsPerPage: 5,
  enableSearch: true,
  enableColumnSearch: true,
  searchFields: ['name', 'email'],
  searchParamName: 'q',
  searchFieldParamName: '_fields',
  allowSearchFieldSelection: true
};
