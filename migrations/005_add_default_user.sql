-- Insert default user if it doesn't exist
INSERT INTO users (id, email, name)
SELECT 
    'b24c5f8a-5e25-4f9d-8492-9bf5f418c408' as id,
    'default@sadashboard.com' as email,
    'Default User' as name
WHERE NOT EXISTS (
    SELECT 1 FROM users 
    WHERE email = 'default@sadashboard.com'
);
