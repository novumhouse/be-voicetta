
# HotelConnect API Backend

This directory contains the FastAPI backend for the HotelConnect API.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL database

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv requests psycopg2-binary
```

4. Create a `.env` file with your configuration:
```
# Database
DATABASE_URL=postgresql://username:password@localhost/hotelconnect

# YieldPlanet API
YIELDPLANET_API_URL=https://api.yieldplanet.com/api/v1.31
YIELDPLANET_API_KEY=your_api_key
YIELDPLANET_API_SECRET=your_api_secret

# Security
API_KEY_HASH=your_hashed_api_key
SECRET_KEY=your_secret_key
```

5. Run the development server:
```bash
uvicorn main:app --reload
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── database.py             # Database connection and models
├── routers/                # API route handlers
│   ├── health.py           # Health check endpoint
│   ├── reservations.py     # Reservation endpoints
│   ├── availability.py     # Availability endpoints
│   ├── properties.py       # Property endpoints
│   └── webhooks.py         # Retell AI webhook endpoints
├── services/               # Business logic
│   ├── yieldplanet.py      # YieldPlanet API client
│   └── retell.py           # Retell AI integration
├── models/                 # Pydantic models for request/response validation
├── migrations/             # Database migrations
└── tests/                  # Test cases
```

## API Documentation

When the server is running, access the OpenAPI documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

For production deployment, we recommend:

1. Building a Docker container:
```bash
docker build -t hotelconnect-api .
```

2. Deploying to AWS ECS or as a Lambda function via AWS Lambda Container Support.

## Testing

Run the test suite:
```bash
pytest
```
