-- Sample SQL queries for testing the conversion tool
-- These are MySQL queries that can be converted to other dialects

-- Query 1: Simple SELECT with WHERE clause
SELECT * FROM users 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
AND status = 'active';

-- Query 2: JOIN with multiple conditions
SELECT 
    o.order_id,
    o.order_date,
    c.customer_name,
    c.email,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
AND c.country = 'USA'
ORDER BY o.order_date DESC
LIMIT 100;

-- Query 3: Aggregate query with GROUP BY and HAVING
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS revenue,
    AVG(total_amount) AS avg_order_value
FROM orders
WHERE status IN ('completed', 'shipped')
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
HAVING SUM(total_amount) > 10000
ORDER BY month DESC;

-- Query 4: Subquery with IF function
SELECT 
    product_id,
    product_name,
    stock_quantity,
    IF(stock_quantity > 100, 'High', IF(stock_quantity > 20, 'Medium', 'Low')) AS stock_level,
    CONCAT(category_name, ' - ', subcategory_name) AS full_category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = 1
AND p.product_id NOT IN (
    SELECT DISTINCT product_id 
    FROM discontinued_products
);

-- Query 5: UPDATE with complex WHERE
UPDATE inventory
SET 
    last_checked = NOW(),
    stock_status = CASE 
        WHEN quantity = 0 THEN 'out_of_stock'
        WHEN quantity < reorder_level THEN 'low_stock'
        ELSE 'in_stock'
    END
WHERE warehouse_id = 5
AND DATEDIFF(NOW(), last_checked) > 7;

-- Query 6: INSERT with ON DUPLICATE KEY UPDATE
INSERT INTO daily_stats (stat_date, page_views, unique_visitors, revenue)
VALUES 
    (CURDATE(), 1500, 850, 4500.00)
ON DUPLICATE KEY UPDATE
    page_views = page_views + VALUES(page_views),
    unique_visitors = VALUES(unique_visitors),
    revenue = revenue + VALUES(revenue);
