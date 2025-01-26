import { QueryItem } from './types';

export const readQueries: QueryItem[] = [
  {
    name: "View all tables",
    query: `SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;`,
    description: 'View all tables in the database'
  },
  {
    name: "View Products",
    query: `SELECT 
  id,
  name,
  price::numeric(10,2) as price,
  description,
  created_at
FROM products
ORDER BY created_at DESC;`,
    description: 'View all products with formatted price'
  },
  {
    name: "View TestTable",
    query: `SELECT 
  name,
  age,
  CASE 
    WHEN age < 30 THEN 'Young'
    WHEN age < 50 THEN 'Middle'
    ELSE 'Senior'
  END as age_group
FROM testtable
ORDER BY age;`,
    description: 'View testtable with age grouping'
  },
  {
    name: "View Table Content",
    query: `SELECT initablecontent
FROM table_content;`,
    description: 'View all table content'
  },
  {
    name: "Products Statistics",
    query: `SELECT 
  COUNT(*) as total_products,
  MIN(price) as min_price,
  MAX(price) as max_price,
  AVG(price)::numeric(10,2) as avg_price
FROM products;`,
    description: 'View products statistics'
  }
];
