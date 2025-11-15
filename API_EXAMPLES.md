# 📖 API Usage Examples

Complete examples for using the AI Website Rebuilder API.

## Table of Contents
- [Authentication](#authentication)
- [Chat Interface](#chat-interface)
- [Website Analysis](#website-analysis)
- [Generate Rebuild](#generate-rebuild)
- [WordPress Deployment](#wordpress-deployment)
- [Preview Pages](#preview-pages)

---

## Authentication

Currently, the API doesn't require authentication for development. In production, you'll need to add a JWT token:

```bash
# Get JWT token (when auth is implemented)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Use token in requests
curl -X GET http://localhost:3001/chat/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Chat Interface

### 1. Create a New Conversation

```bash
curl -X POST http://localhost:3001/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Rebuild for Acme Restaurant",
    "userId": "user-123",
    "metadata": {
      "restaurantName": "Acme Restaurant"
    }
  }'
```

**Response:**
```json
{
  "id": "conv-abc123",
  "title": "Website Rebuild for Acme Restaurant",
  "userId": "user-123",
  "createdAt": "2025-11-15T20:00:00.000Z",
  "metadata": {
    "restaurantName": "Acme Restaurant"
  }
}
```

### 2. Send a Message (Streaming)

```bash
curl -X POST http://localhost:3001/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Please analyze this website: https://example-restaurant.com",
    "conversationId": "conv-abc123",
    "userId": "user-123"
  }'
```

**Response (Server-Sent Events):**
```json
{"type":"conversation_id","data":"conv-abc123"}
{"type":"message_id","data":"msg-xyz789"}
{"type":"content","data":"I'll analyze that website for you..."}
{"type":"content","data":" Let me extract the information..."}
{"type":"done","data":{"conversationId":"conv-abc123","messageId":"msg-xyz789"}}
```

### 3. Get Conversation History

```bash
curl http://localhost:3001/chat/conversations/conv-abc123
```

**Response:**
```json
{
  "id": "conv-abc123",
  "title": "Website Rebuild for Acme Restaurant",
  "userId": "user-123",
  "messages": [
    {
      "id": "msg-1",
      "role": "USER",
      "content": "Please analyze this website: https://example-restaurant.com",
      "createdAt": "2025-11-15T20:00:00.000Z"
    },
    {
      "id": "msg-2",
      "role": "ASSISTANT",
      "content": "I'll analyze that website for you...",
      "createdAt": "2025-11-15T20:00:05.000Z"
    }
  ],
  "createdAt": "2025-11-15T20:00:00.000Z"
}
```

### 4. List All Conversations

```bash
# All conversations
curl http://localhost:3001/chat/conversations

# For specific user
curl http://localhost:3001/chat/conversations?userId=user-123&limit=10
```

---

## Website Analysis

### Analyze a Restaurant Website

**Using Direct API:**
```bash
curl -X POST http://localhost:3001/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example-restaurant.com"
  }'
```

**Using Chat Interface:**
```bash
curl -X POST http://localhost:3001/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Analyze https://example-restaurant.com",
    "userId": "user-123"
  }'
```

**Response:**
```json
{
  "analysisId": "analysis-123",
  "url": "https://example-restaurant.com",
  "status": "completed",
  "restaurantInfo": {
    "name": "Acme Restaurant",
    "description": "A family-owned Italian restaurant...",
    "primaryColors": ["#c41e3a", "#ffffff", "#000000"],
    "contactInfo": {
      "phone": "(555) 123-4567",
      "email": "info@acme-restaurant.com",
      "address": "123 Main St, City, State 12345"
    }
  },
  "pages": [
    {
      "url": "https://example-restaurant.com/",
      "pageType": "home",
      "confidence": 0.95
    },
    {
      "url": "https://example-restaurant.com/menu",
      "pageType": "menu",
      "confidence": 0.98
    },
    {
      "url": "https://example-restaurant.com/about",
      "pageType": "about",
      "confidence": 0.92
    },
    {
      "url": "https://example-restaurant.com/contact",
      "pageType": "contact",
      "confidence": 0.96
    }
  ]
}
```

### Get Analysis Status

```bash
curl http://localhost:3001/analysis/status/analysis-123
```

---

## Generate Rebuild

### Create Bricks Pages from Analysis

```bash
curl -X POST http://localhost:3001/rebuild/generate \
  -H "Content-Type: application/json" \
  -d '{
    "analysisId": "analysis-123"
  }'
```

**Response:**
```json
{
  "rebuildId": "rebuild-456",
  "siteAnalysisId": "analysis-123",
  "status": "completed",
  "pages": [
    {
      "id": "page-1",
      "pageType": "home",
      "title": "Home",
      "slug": "home",
      "elementsCount": 12
    },
    {
      "id": "page-2",
      "pageType": "menu",
      "title": "Our Menu",
      "slug": "menu",
      "elementsCount": 8
    },
    {
      "id": "page-3",
      "pageType": "about",
      "title": "About Us",
      "slug": "about",
      "elementsCount": 6
    },
    {
      "id": "page-4",
      "pageType": "contact",
      "title": "Contact Us",
      "slug": "contact",
      "elementsCount": 5
    }
  ],
  "previewUrl": "http://localhost:3000/preview/rebuild-456"
}
```

### Get Rebuild Status

```bash
curl http://localhost:3001/rebuild/status/rebuild-456
```

---

## WordPress Deployment

### 1. Test WordPress Connection

```bash
curl -X POST http://localhost:3001/wordpress/test \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://your-wordpress-site.com",
    "username": "admin",
    "applicationPassword": "xxxx xxxx xxxx xxxx xxxx xxxx"
  }'
```

**Response:**
```json
{
  "success": true,
  "version": "6.4.2"
}
```

### 2. Deploy to WordPress

```bash
curl -X POST http://localhost:3001/wordpress/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "rebuildId": "rebuild-456",
    "credentials": {
      "baseUrl": "https://your-wordpress-site.com",
      "username": "admin",
      "applicationPassword": "xxxx xxxx xxxx xxxx xxxx xxxx"
    },
    "publishImmediately": false
  }'
```

**Response:**
```json
{
  "deploymentId": "deploy-789",
  "rebuildId": "rebuild-456",
  "status": "completed",
  "pages": [
    {
      "pageId": "page-1",
      "wordPressId": 42,
      "title": "Home",
      "status": "success",
      "url": "https://your-wordpress-site.com/home"
    },
    {
      "pageId": "page-2",
      "wordPressId": 43,
      "title": "Our Menu",
      "status": "success",
      "url": "https://your-wordpress-site.com/menu"
    },
    {
      "pageId": "page-3",
      "wordPressId": 44,
      "title": "About Us",
      "status": "success",
      "url": "https://your-wordpress-site.com/about"
    },
    {
      "pageId": "page-4",
      "wordPressId": 45,
      "title": "Contact Us",
      "status": "success",
      "url": "https://your-wordpress-site.com/contact"
    }
  ],
  "totalPages": 4,
  "successfulPages": 4,
  "failedPages": 0
}
```

### 3. Get Deployment Status

```bash
curl http://localhost:3001/wordpress/deployments/deploy-789
```

### 4. List All Deployments for a Rebuild

```bash
curl http://localhost:3001/wordpress/deployments?rebuildId=rebuild-456
```

---

## Preview Pages

### Preview All Pages

```bash
curl http://localhost:3001/preview/rebuild-456
```

This returns an HTML page with all generated pages.

### Preview Single Page

```bash
curl http://localhost:3001/preview/rebuild-456/menu
```

Returns HTML preview of the menu page.

---

## Complete Workflow Example

### Full End-to-End Process

```bash
#!/bin/bash

# 1. Create a conversation
CONV_RESPONSE=$(curl -s -X POST http://localhost:3001/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rebuild Acme Restaurant",
    "userId": "user-123"
  }')

CONV_ID=$(echo $CONV_RESPONSE | jq -r '.id')
echo "Created conversation: $CONV_ID"

# 2. Analyze website
curl -X POST http://localhost:3001/chat/send \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"Analyze https://example-restaurant.com\",
    \"conversationId\": \"$CONV_ID\",
    \"userId\": \"user-123\"
  }" \
  > /dev/null

echo "Website analysis started..."
sleep 5

# 3. Get the analysis ID from conversation
# (In real implementation, you'd parse the AI response)
ANALYSIS_ID="analysis-123"

# 4. Generate rebuild
REBUILD_RESPONSE=$(curl -s -X POST http://localhost:3001/rebuild/generate \
  -H "Content-Type: application/json" \
  -d "{
    \"analysisId\": \"$ANALYSIS_ID\"
  }")

REBUILD_ID=$(echo $REBUILD_RESPONSE | jq -r '.rebuildId')
echo "Generated rebuild: $REBUILD_ID"

# 5. Preview the rebuild
echo "Preview available at: http://localhost:3001/preview/$REBUILD_ID"

# 6. Deploy to WordPress
DEPLOY_RESPONSE=$(curl -s -X POST http://localhost:3001/wordpress/deploy \
  -H "Content-Type: application/json" \
  -d "{
    \"rebuildId\": \"$REBUILD_ID\",
    \"credentials\": {
      \"baseUrl\": \"https://your-wordpress-site.com\",
      \"username\": \"admin\",
      \"applicationPassword\": \"xxxx xxxx xxxx xxxx xxxx xxxx\"
    },
    \"publishImmediately\": false
  }")

DEPLOYMENT_ID=$(echo $DEPLOY_RESPONSE | jq -r '.deploymentId')
echo "Deployment created: $DEPLOYMENT_ID"

# 7. Check deployment status
curl -s http://localhost:3001/wordpress/deployments/$DEPLOYMENT_ID | jq
```

---

## Error Handling

### Common Error Responses

**Rate Limit Exceeded (429):**
```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "ThrottlerException"
}
```

**Validation Error (422):**
```json
{
  "statusCode": 422,
  "message": [
    "content must be a string",
    "userId should not be empty"
  ],
  "error": "Unprocessable Entity"
}
```

**Not Found (404):**
```json
{
  "statusCode": 404,
  "message": "Conversation conv-abc123 not found",
  "error": "Not Found"
}
```

**Server Error (500):**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limits

Current rate limits (configurable in `app.module.ts`):

- **Short**: 10 requests per second
- **Medium**: 100 requests per minute
- **Long**: 1000 requests per hour

Headers included in responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1700000000
```

---

## Testing with Postman

1. Import the OpenAPI spec: http://localhost:3001/api/docs-json
2. Set base URL: `http://localhost:3001`
3. Add environment variables:
   - `baseUrl`: `http://localhost:3001`
   - `userId`: `test-user-123`

---

## Tips

- **Streaming Responses**: Use Server-Sent Events for real-time AI responses
- **Rate Limiting**: Implement exponential backoff for retries
- **Error Handling**: Always check response status codes
- **Webhooks**: (Future) Subscribe to deployment completion events
- **Batch Operations**: (Future) Deploy multiple rebuilds at once

---

## Next Steps

- See [QUICK_START.md](./QUICK_START.md) for setup instructions
- See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for production readiness
- Open Swagger docs for interactive testing: http://localhost:3001/api/docs
