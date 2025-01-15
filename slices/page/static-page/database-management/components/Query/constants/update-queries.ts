import { QueryItem } from './types';

export const updateQueries: QueryItem[] = [
  {
    name: "Update Product",
    query: `UPDATE products 
SET 
  price = price * 1.1,
  description = description || ' (Price Updated)'
WHERE price < 100;`,
    description: 'Increase price of products under $100'
  },
  {
    name: "Update TestTable Age",
    query: `UPDATE testtable 
SET age = age + 1
WHERE age < 30;`,
    description: 'Increment age for young people'
  },
  {
    name: "Update Table Content",
    query: `UPDATE table_content 
SET initablecontent = 'Updated: ' || initablecontent
WHERE initablecontent LIKE 'Sample%';`,
    description: 'Update content with prefix'
  },
  {
    name: "Bulk Update Products",
    query: `UPDATE products 
SET description = CASE
  WHEN price < 100 THEN 'Budget Item'
  WHEN price < 500 THEN 'Mid-Range Item'
  ELSE 'Premium Item'
END;`,
    description: 'Update descriptions based on price range'
  }
];
