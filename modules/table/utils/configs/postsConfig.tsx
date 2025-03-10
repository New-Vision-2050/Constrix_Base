
import { TableConfig } from './tableConfig';

export const postsConfig: TableConfig = {
  url: 'https://jsonplaceholder.typicode.com/posts',
  columns: [
    { key: 'id', label: 'ID', sortable: true, searchable: false },
    {
      key: 'userId',
      label: 'User ID',
      sortable: true,
      searchable: true,
      searchType: {
        type: 'dropdown',
        placeholder: 'Select user',
        dynamicDropdown: {
          url: 'https://jsonplaceholder.typicode.com/users',
          valueField: 'id',
          labelField: 'name',
          paginationEnabled: true,
          itemsPerPage: 5,
          searchParam: 'q',
          pageParam: 'page',
          limitParam: 'per_page',
          totalCountHeader: 'x-total-count'
        }
      }
    },
    { key: 'title', label: 'Title', sortable: true, searchable: true },
    { key: 'body', label: 'Content', sortable: false, searchable: true }
  ],
  defaultItemsPerPage: 5,
  enableSorting: true,
  enablePagination: true,
  enableSearch: true,
  enableColumnSearch: true,
  searchFields: ['title', 'body'],
  searchParamName: 'q',
  allowSearchFieldSelection: true
};
