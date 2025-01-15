import { QueryItem } from './types';

export const joinQueries: QueryItem[] = [
  {
    name: "Products with Orders",
    query: `SELECT 
  p.name as product_name,
  p.price as unit_price,
  o.quantity,
  o.total_price,
  o.order_date
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
ORDER BY o.order_date DESC NULLS LAST;`,
    description: 'Join products with orders'
  },
  {
    name: "Product Categories",
    query: `WITH price_categories AS (
  SELECT 
    CASE 
      WHEN price < 100 THEN 'Budget'
      WHEN price < 500 THEN 'Mid-Range'
      ELSE 'Premium'
    END as category,
    COUNT(*) as product_count,
    AVG(price)::numeric(10,2) as avg_price
  FROM products
  GROUP BY 1
)
SELECT * FROM price_categories
ORDER BY avg_price DESC;`,
    description: 'Group products by price category'
  },
  {
    name: "Cross Table Report",
    query: `SELECT 
  p.name as product_name,
  t.name as tester_name,
  t.age as tester_age
FROM products p
CROSS JOIN testtable t
WHERE p.price > 100
ORDER BY p.price DESC, t.age;`,
    description: 'Cross join products with test users'
  }
];
