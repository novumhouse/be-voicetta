
from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time
import os
from typing import Dict, List, Optional
import models
from database import engine, get_db
from datetime import datetime
import json
import uuid

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HotelConnect API",
    description="API for connecting Retell AI voicebots to YieldPlanet's API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for logging API requests and responses
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Start timer
    start_time = time.time()
    
    # Get request body
    request_body = b""
    async for chunk in request.body():
        request_body += chunk
    
    # Create a new request with the original body
    request._body = request_body
    
    # Process the request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Only log API requests (not static files, etc.)
    if request.url.path.startswith("/api"):
        # Create log entry in database
        try:
            db = next(get_db())
            
            # Parse request body if JSON
            try:
                parsed_body = json.loads(request_body) if request_body else None
            except:
                parsed_body = None
            
            # Get response body
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk
            
            # Reconstruct response with the body
            response = Response(
                content=response_body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type
            )
            
            # Parse response body if JSON
            try:
                parsed_response = json.loads(response_body) if response_body else None
            except:
                parsed_response = None
            
            # Create log entry
            log_entry = models.APILog(
                request_method=request.method,
                request_path=str(request.url),
                request_headers=dict(request.headers),
                request_body=parsed_body,
                response_status=response.status_code,
                response_body=parsed_response,
                source="client",  # Default to client, can be overridden in specific endpoints
                duration_ms=duration * 1000,
            )
            
            db.add(log_entry)
            db.commit()
        except Exception as e:
            print(f"Error logging request: {str(e)}")
    
    return response

# Health check endpoint
@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """
    Check the health of the API and its dependencies
    """
    try:
        # Check database connection
        db.execute("SELECT 1")
        db_status = "ok"
    except Exception as e:
        db_status = "down"
    
    # TODO: Add YieldPlanet API check when implemented
    yp_status = "ok"  # Placeholder
    
    # Determine overall status
    if db_status == "down" or yp_status == "down":
        status = "down"
    elif db_status == "degraded" or yp_status == "degraded":
        status = "degraded"
    else:
        status = "ok"
    
    return {
        "status": status,
        "version": "1.0.0",
        "uptime": 0,  # TODO: Implement uptime tracking
        "dependencies": {
            "database": db_status,
            "yieldplanet": yp_status
        }
    }

# Get property details
@app.get("/api/properties/{property_id}")
def get_property(property_id: str, db: Session = Depends(get_db)):
    """
    Get property details by ID
    """
    property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {
        "id": property.id,
        "name": property.name,
        "description": property.description,
        "address": property.address,
        "city": property.city,
        "country": property.country,
        "zipCode": property.zip_code,
        "contactEmail": property.contact_email,
        "contactPhone": property.contact_phone,
        "facilities": property.facilities,
        "images": property.images
    }

# Check room availability
@app.get("/api/availability")
def check_availability(
    property_id: str,
    start_date: str,
    end_date: str,
    adults: int = 1,
    children: int = 0,
    db: Session = Depends(get_db)
):
    """
    Check room availability for a property between start_date and end_date
    """
    # Parse dates
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Get property
    property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Find rooms with availability for the entire period
    available_rooms = []
    
    # Get all rooms for the property
    rooms = db.query(models.Room).filter(models.Room.property_id == property_id).all()
    
    # Check availability for each room
    for room in rooms:
        # Room must have enough capacity
        if room.max_occupancy < (adults + children):
            continue
        
        # TODO: Implement more sophisticated availability checking
        # For now, just return all rooms as available with dummy prices
        available_rooms.append({
            "id": room.id,
            "name": room.name,
            "description": room.description,
            "maxOccupancy": room.max_occupancy,
            "price": room.base_price,
            "currency": room.currency,
            "available": True
        })
    
    return {
        "propertyId": property_id,
        "startDate": start_date,
        "endDate": end_date,
        "rooms": available_rooms
    }

# Create new reservation
@app.post("/api/reservations")
def create_reservation(
    reservation_data: dict,
    db: Session = Depends(get_db)
):
    """
    Create a new reservation
    """
    # Generate reservation ID
    reservation_id = str(uuid.uuid4())
    
    # Extract data from request
    property_id = reservation_data.get("propertyId")
    room_id = reservation_data.get("roomId")
    guest_name = reservation_data.get("guestName")
    guest_email = reservation_data.get("guestEmail")
    check_in = reservation_data.get("checkIn")
    check_out = reservation_data.get("checkOut")
    adults = reservation_data.get("adults", 1)
    children = reservation_data.get("children", 0)
    total_price = reservation_data.get("totalPrice")
    currency = reservation_data.get("currency", "USD")
    
    # Validate required fields
    if not all([property_id, room_id, guest_name, guest_email, check_in, check_out, total_price]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Parse dates
    try:
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Create reservation
    new_reservation = models.Reservation(
        id=reservation_id,
        property_id=property_id,
        room_id=room_id,
        guest_name=guest_name,
        guest_email=guest_email,
        check_in=check_in_date,
        check_out=check_out_date,
        adults=adults,
        children=children,
        total_price=total_price,
        currency=currency,
        status="pending",  # Default status
        notes=reservation_data.get("notes")
    )
    
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    
    # Return reservation data
    return {
        "id": new_reservation.id,
        "propertyId": new_reservation.property_id,
        "roomId": new_reservation.room_id,
        "guestName": new_reservation.guest_name,
        "guestEmail": new_reservation.guest_email,
        "checkIn": check_in,
        "checkOut": check_out,
        "adults": new_reservation.adults,
        "children": new_reservation.children,
        "totalPrice": new_reservation.total_price,
        "currency": new_reservation.currency,
        "status": new_reservation.status,
        "createdAt": new_reservation.created_at.isoformat(),
        "updatedAt": new_reservation.updated_at.isoformat() if new_reservation.updated_at else None
    }

# Update existing reservation
@app.put("/api/reservations/{reservation_id}")
def update_reservation(
    reservation_id: str,
    update_data: dict,
    db: Session = Depends(get_db)
):
    """
    Update an existing reservation
    """
    # Get reservation
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Update fields
    for key, value in update_data.items():
        if key == "checkIn" and value:
            try:
                reservation.check_in = datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format for checkIn. Use YYYY-MM-DD")
        elif key == "checkOut" and value:
            try:
                reservation.check_out = datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format for checkOut. Use YYYY-MM-DD")
        elif key == "propertyId" and value:
            reservation.property_id = value
        elif key == "roomId" and value:
            reservation.room_id = value
        elif key == "guestName" and value:
            reservation.guest_name = value
        elif key == "guestEmail" and value:
            reservation.guest_email = value
        elif key == "adults" and value is not None:
            reservation.adults = value
        elif key == "children" and value is not None:
            reservation.children = value
        elif key == "totalPrice" and value is not None:
            reservation.total_price = value
        elif key == "currency" and value:
            reservation.currency = value
        elif key == "status" and value:
            reservation.status = value
        elif key == "notes" and value is not None:
            reservation.notes = value
    
    db.commit()
    db.refresh(reservation)
    
    # Return updated reservation
    return {
        "id": reservation.id,
        "propertyId": reservation.property_id,
        "roomId": reservation.room_id,
        "guestName": reservation.guest_name,
        "guestEmail": reservation.guest_email,
        "checkIn": reservation.check_in.strftime("%Y-%m-%d"),
        "checkOut": reservation.check_out.strftime("%Y-%m-%d"),
        "adults": reservation.adults,
        "children": reservation.children,
        "totalPrice": reservation.total_price,
        "currency": reservation.currency,
        "status": reservation.status,
        "createdAt": reservation.created_at.isoformat(),
        "updatedAt": reservation.updated_at.isoformat() if reservation.updated_at else None
    }

# Webhook endpoint for Retell AI
@app.post("/api/webhooks/retell")
async def retell_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint for Retell AI custom functions
    """
    # Parse request body
    payload = await request.json()
    
    # Log request with source = retell
    log_entry = models.APILog(
        request_method=request.method,
        request_path=str(request.url),
        request_headers=dict(request.headers),
        request_body=payload,
        source="retell",
    )
    db.add(log_entry)
    
    # TODO: Implement actual Retell webhook handling
    # For now, just return a success response
    response = {
        "status": "success",
        "message": "Webhook received",
        "data": payload
    }
    
    # Update log with response
    log_entry.response_status = 200
    log_entry.response_body = response
    db.commit()
    
    return response

# Main entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
