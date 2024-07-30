from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from typing import Optional
from database import Base
from pydantic import BaseModel

class Student(Base):
    __tablename__ = 'student'

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String, index=True)
    lastname = Column(String, index=True)
    stu_id = Column(Integer, index=True)
    dob = Column(String, index=True)
    sex = Column(String, index=True)
    age = Column(Integer, index=True)
    
class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    year = Column(Integer, index=True)
    is_published = Column(Boolean, index=True)
    description = Column(String, index=True)
    synopsis = Column(String, index=True)
    category = Column(String, index=True)

class Menu(Base):
    __tablename__ = 'menu'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, index=True)
    description = Column(String, index=True)

class Order(Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menu.id", ondelete="CASCADE"), index=True)
    menu = relationship("Menu")
    quantity = Column(Integer, index=True)
    status = Column(String, default="pending", index=True)
    note = Column(String, index=True)

class OrderResponse(BaseModel):
    id: int
    menu_id: int
    quantity: int
    status: str
    note: str
    menu_name: str


class OrderCreate(BaseModel):
    menu_id: int
    quantity: int
    note: str = None

class OrderUpdate(BaseModel):
    menu_id: Optional[int] = None
    quantity: Optional[int] = None
    note: Optional[str] = None
    status: Optional[str] = None