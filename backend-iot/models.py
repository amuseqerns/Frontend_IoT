from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship

from database import Base

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    year = Column(Integer, index=True)
    description = Column(String, index=True)
    prologue = Column(String, index=True)
    type1 = Column(String, index=True)
    type2 = Column(String, index=True)
    type3 = Column(String, index=True)
    type4 = Column(String, index=True)
    is_published = Column(Boolean, index=True)

