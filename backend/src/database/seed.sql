-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Laptops', 'Portable computers for various use cases'),
(2, 'PC Components', 'Parts for building or upgrading desktop computers'),
(3, 'TVs', 'Televisions for home entertainment'),
(4, 'Accessories', 'General accessories for electronics and furniture')
ON CONFLICT DO NOTHING;

-- Insert Products (Laptops)
INSERT INTO products (category_id, name, brand, price, stock_quantity, specifications) VALUES
(1, 'MacBook Air M3 (13-inch)', 'Apple', 114900.00, 30, '{"ram_gb": 8, "storage_gb": 256, "storage_type": "SSD", "os": "macOS", "screen_size": 13.6, "gpu": "Apple M3 8-core", "weight_kg": 1.24}'),
(1, 'MacBook Pro M3 Max (16-inch)', 'Apple', 349900.00, 10, '{"ram_gb": 36, "storage_gb": 1024, "storage_type": "SSD", "os": "macOS", "screen_size": 16.2, "gpu": "Apple M3 Max 30-core", "weight_kg": 2.14}'),
(1, 'Vivobook 16X OLED', 'ASUS', 74990.00, 25, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 16.0, "gpu": "AMD Radeon Graphics", "weight_kg": 1.76}'),
(1, 'ROG Zephyrus G14', 'ASUS', 164990.00, 15, '{"ram_gb": 16, "storage_gb": 1024, "storage_type": "SSD", "os": "Windows 11", "screen_size": 14.0, "gpu": "NVIDIA RTX 4060", "weight_kg": 1.65}'),
(1, 'XPS 13 Plus', 'Dell', 154990.00, 12, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 13.4, "gpu": "Intel Iris Xe", "weight_kg": 1.23}'),
(1, 'Alienware m16 R2', 'Dell', 189990.00, 8, '{"ram_gb": 32, "storage_gb": 1024, "storage_type": "SSD", "os": "Windows 11", "screen_size": 16.0, "gpu": "NVIDIA RTX 4070", "weight_kg": 2.61}'),
(1, 'ThinkPad X1 Carbon Gen 11', 'Lenovo', 174900.00, 20, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11 Pro", "screen_size": 14.0, "gpu": "Intel Iris Xe", "weight_kg": 1.12}'),
(1, 'Legion Pro 5i', 'Lenovo', 144990.00, 18, '{"ram_gb": 16, "storage_gb": 1024, "storage_type": "SSD", "os": "Windows 11", "screen_size": 16.0, "gpu": "NVIDIA RTX 4060", "weight_kg": 2.5}'),
(1, 'IdeaPad Slim 3', 'Lenovo', 42990.00, 40, '{"ram_gb": 8, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 15.6, "gpu": "Intel UHD Graphics", "weight_kg": 1.62}'),
(1, 'Spectre x360 14', 'HP', 139999.00, 15, '{"ram_gb": 16, "storage_gb": 1024, "storage_type": "SSD", "os": "Windows 11", "screen_size": 13.5, "gpu": "Intel Iris Xe", "weight_kg": 1.36}'),
(1, 'Omen 16', 'HP', 124990.00, 20, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 16.1, "gpu": "NVIDIA RTX 4050", "weight_kg": 2.37}'),
(1, 'Swift 3', 'Acer', 59990.00, 30, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 14.0, "gpu": "AMD Radeon Graphics", "weight_kg": 1.2}'),
(1, 'Predator Helios Neo 16', 'Acer', 109990.00, 22, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 16.0, "gpu": "NVIDIA RTX 4050", "weight_kg": 2.6}'),
(1, 'Galaxy Book4 Pro', 'Samsung', 131990.00, 10, '{"ram_gb": 16, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 14.0, "gpu": "Intel Arc Graphics", "weight_kg": 1.23}'),
(1, 'Bravo 15', 'MSI', 54990.00, 25, '{"ram_gb": 8, "storage_gb": 512, "storage_type": "SSD", "os": "Windows 11", "screen_size": 15.6, "gpu": "AMD Radeon RX 6550M", "weight_kg": 2.25}');

-- Insert Products (PC Components)
INSERT INTO products (category_id, name, brand, price, stock_quantity, specifications) VALUES
(2, 'Core i9-14900K', 'Intel', 58000.00, 15, '{"type": "CPU", "socket": "LGA1700", "cores": 24}'),
(2, 'Ryzen 7 7800X3D', 'AMD', 38000.00, 25, '{"type": "CPU", "socket": "AM5", "cores": 8}'),
(2, 'GeForce RTX 4090 24GB', 'NVIDIA', 185000.00, 5, '{"type": "GPU", "vram_gb": 24}'),
(2, 'Radeon RX 7900 XTX', 'AMD', 95000.00, 10, '{"type": "GPU", "vram_gb": 24}'),
(2, '32GB DDR5-6000 Trident Z5', 'G.Skill', 11500.00, 40, '{"type": "RAM", "capacity_gb": 32, "generation": "DDR5"}'),
(2, '2TB 990 PRO NVMe SSD', 'Samsung', 16500.00, 50, '{"type": "Storage", "capacity_gb": 2048, "interface": "NVMe"}');

-- Insert Products (TVs)
INSERT INTO products (category_id, name, brand, price, stock_quantity, specifications) VALUES
(3, 'LG C3 55" OLED 4K Smart TV', 'LG', 129990.00, 15, '{"screen_size_inch": 55, "resolution": "4K", "smart": true, "display_type": "OLED"}'),
(3, 'Samsung S90C 65" OLED 4K', 'Samsung', 174990.00, 10, '{"screen_size_inch": 65, "resolution": "4K", "smart": true, "display_type": "OLED"}'),
(3, 'Sony BRAVIA XR X90L 55"', 'Sony', 104990.00, 20, '{"screen_size_inch": 55, "resolution": "4K", "smart": true, "display_type": "Full Array LED"}'),
(3, 'TCL 55" 4K QLED TV', 'TCL', 39990.00, 40, '{"screen_size_inch": 55, "resolution": "4K", "smart": true, "display_type": "QLED"}');

-- Insert Products (Accessories)
INSERT INTO products (category_id, name, brand, price, stock_quantity, specifications) VALUES
(4, 'MX Master 3S Wireless Mouse', 'Logitech', 9995.00, 60, '{"type": "Mouse", "wireless": true, "ergonomic": true}'),
(4, 'AirPods Pro (2nd Gen)', 'Apple', 24900.00, 45, '{"type": "Earbuds", "wireless": true, "anc": true}'),
(4, 'Keychron K2 Wireless Mechanical Keyboard', 'Keychron', 8500.00, 30, '{"type": "Keyboard", "mechanical": true, "wireless": true}'),
(4, 'Dell 27" 4K USB-C Hub Monitor (U2723QE)', 'Dell', 48000.00, 15, '{"type": "Monitor", "resolution": "4K", "size_inch": 27}'),
(4, 'Sony WH-1000XM5 Wireless Headphones', 'Sony', 29990.00, 25, '{"type": "Headphones", "wireless": true, "anc": true}');
