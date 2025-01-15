import { QueryItem } from './types';

export const createQueries: QueryItem[] = [
  {
    name: "Create Products Table",
    query: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    description: 'Create a new products table'
  },
  {
    name: "Create Orders Table",
    query: `CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    description: 'Create a new orders table with foreign key to products'
  },
  {
    name: "Insert into Products",
    query: `INSERT INTO products (name, price, description)
VALUES 
  ('Laptop', 999.99, 'High-performance laptop'),
  ('Smartphone', 499.99, 'Latest model smartphone'),
  ('Headphones', 79.99, 'Wireless noise-canceling headphones');`,
    description: 'Insert multiple products'
  },
  {
    name: "Insert into TestTable",
    query: `INSERT INTO testtable (name, age)
VALUES 
  ('John Doe', 25),
  ('Jane Smith', 30),
  ('Bob Wilson', 35);`,
    description: 'Insert test data into testtable'
  },
  {
    name: "Insert into Table Content",
    query: `INSERT INTO table_content (initablecontent)
VALUES ('Sample content 1'),
       ('Sample content 2'),
       ('Sample content 3');`,
    description: 'Insert content into table_content'
  }
];
