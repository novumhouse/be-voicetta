
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Table, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    address = Column(String)
    city = Column(String)
    country = Column(String)
    zip_code = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    facilities = Column(JSON)  # Stored as JSON array
    images = Column(JSON)  # Stored as JSON array
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    rooms = relationship("Room", back_populates="property", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="property")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    property_id = Column(String, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    max_occupancy = Column(Integer, nullable=False)
    base_price = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="USD")
    amenities = Column(JSON)  # Stored as JSON array
    images = Column(JSON)  # Stored as JSON array
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship("Property", back_populates="rooms")
    availabilities = relationship("Availability", back_populates="room", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="room")

class Availability(Base):
    __tablename__ = "availabilities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    available = Column(Boolean, nullable=False, default=True)
    price = Column(Float)  # Override base price if needed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    room = relationship("Room", back_populates="availabilities")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, index=True)
    property_id = Column(String, ForeignKey("properties.id"), nullable=False)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    check_in = Column(DateTime(timezone=True), nullable=False)
    check_out = Column(DateTime(timezone=True), nullable=False)
    adults = Column(Integer, nullable=False, default=1)
    children = Column(Integer, nullable=False, default=0)
    total_price = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="USD")
    status = Column(String, nullable=False)  # confirmed, pending, cancelled
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship("Property", back_populates="reservations")
    room = relationship("Room", back_populates="reservations")

class APILog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    request_method = Column(String, nullable=False)
    request_path = Column(String, nullable=False)
    request_headers = Column(JSON)
    request_body = Column(JSON)
    response_status = Column(Integer)
    response_body = Column(JSON)
    source = Column(String)  # "retell" or "yieldplanet" or "client"
    error = Column(Text)
    duration_ms = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
