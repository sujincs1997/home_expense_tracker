from sqlalchemy import Column, Integer, Float, String, Date
from database import Base
import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, index=True)
    description = Column(String)
    date = Column(Date, default=datetime.date.today)
