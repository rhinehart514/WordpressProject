# Bricks API Bridge WordPress Plugin

REST API bridge for programmatic Bricks Builder page creation.

## Features

- ✅ REST API endpoints for creating Bricks pages
- ✅ Reusable restaurant-specific element templates
- ✅ Hero sections, menus, galleries, contact forms
- ✅ Secure Bearer token authentication
- ✅ Page creation, updating, and deletion
- ✅ Compatible with Bricks Builder 1.7.3+

## Requirements

- WordPress 5.6+
- PHP 7.4+
- Bricks Builder (installed and activated)

## Installation

1. Upload the `bricks-api-bridge` folder to `/wp-content/plugins/`
2. Activate the plugin through the WordPress Plugins menu
3. Bricks Builder must be installed and activated

## API Endpoints

### Base URL
```
https://your-site.com/wp-json/bricks-api/v1
```

### Authentication

Use Bearer token authentication:

```bash
Authorization: Bearer YOUR_API_TOKEN
```

Set your API token in WordPress:
```php
update_option('bricks_api_bridge_token', 'your-secure-token-here');
```

### Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Bricks API Bridge is running",
  "version": "0.1.0",
  "bricks_version": "1.9.0",
  "wp_version": "6.4"
}
```

#### Create Restaurant Page
```http
POST /create-restaurant-page
Content-Type: application/json
```

Request Body:
```json
{
  "name": "Mario's Italian Restaurant",
  "tagline": "Authentic Italian Cuisine Since 1985",
  "hero_image": "https://example.com/hero.jpg",
  "menu_items": [
    {
      "name": "Margherita Pizza",
      "description": "Fresh mozzarella, basil, tomato sauce",
      "price": "$14.99",
      "image": "https://example.com/pizza.jpg"
    }
  ],
  "gallery_images": [
    "https://example.com/img1.jpg",
    "https://example.com/img2.jpg"
  ],
  "phone": "(555) 123-4567",
  "address": "123 Main St, City, ST 12345",
  "email": "info@marios.com",
  "hours": [
    {"day": "Monday", "hours": "11:00 AM - 10:00 PM"},
    {"day": "Tuesday", "hours": "11:00 AM - 10:00 PM"}
  ],
  "status": "publish"
}
```

Response:
```json
{
  "success": true,
  "post_id": 123,
  "url": "https://yoursite.com/marios-italian-restaurant",
  "edit_url": "https://yoursite.com/wp-admin/post.php?post=123&action=edit"
}
```

#### Update Restaurant Page
```http
PUT /update-restaurant-page/{post_id}
Content-Type: application/json
```

Request Body:
```json
{
  "menu_items": [...],
  "gallery_images": [...]
}
```

#### Delete Restaurant Page
```http
DELETE /delete-restaurant-page/{post_id}
```

#### Get Page Info
```http
GET /page-info/{post_id}
```

## Usage from Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://your-site.com/wp-json/bricks-api/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

async function createRestaurantPage(data) {
  const response = await api.post('/create-restaurant-page', data);
  return response.data;
}

// Usage
const result = await createRestaurantPage({
  name: 'My Restaurant',
  hero_image: 'https://example.com/hero.jpg',
  menu_items: [...],
  status: 'publish'
});

console.log('Page created:', result.url);
```

## Element Templates

The plugin provides pre-built element templates:

- **Hero Section** - Full-width hero with background image, title, tagline, CTA
- **Menu Section** - Grid layout for menu items with images, names, descriptions, prices
- **Gallery Section** - Responsive image gallery
- **Contact Section** - Contact information (address, phone, email)
- **Hours Section** - Operating hours display

## Security

- Bearer token authentication required
- User capability checks (edit_posts)
- Input sanitization
- WordPress nonce verification
- Secure meta data storage

## Development

### File Structure
```
bricks-api-bridge/
├── bricks-api-bridge.php          # Main plugin file
├── includes/
│   ├── class-bricks-api-endpoints.php       # REST API routes
│   ├── class-bricks-page-creator.php        # Page creation logic
│   └── class-bricks-restaurant-elements.php # Element templates
└── README.md
```

### Extending

Add custom element templates:

```php
// In class-bricks-restaurant-elements.php
public static function custom_section($data) {
    return [
        'id' => self::generate_id('custom'),
        'name' => 'section',
        'settings' => [...],
        'children' => [...]
    ];
}
```

## Support

For issues and questions, please open an issue on GitHub.

## License

GPL v2 or later
