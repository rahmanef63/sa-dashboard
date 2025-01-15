import { QueryItem } from './types';

export const deleteQueries: QueryItem[] = [
  {
    name: "Delete from Products",
    query: `DELETE FROM products
WHERE price < 10
  OR description IS NULL;`,
    description: 'Delete cheap or undescribed products'
  },
  {
    name: "Delete from TestTable",
    query: `DELETE FROM testtable
WHERE age > 50;`,
    description: 'Delete records of senior people'
  },
  {
    name: "Clear Table Content",
    query: `DELETE FROM table_content
WHERE initablecontent LIKE '%outdated%';`,
    description: 'Delete outdated content'
  },
  {
    name: "Drop Table Safely",
    query: `DROP TABLE IF EXISTS temporary_table CASCADE;`,
    description: 'Safely drop a table if it exists'
  }
];
