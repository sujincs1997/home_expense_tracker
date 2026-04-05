from pydantic import BaseModel
from datetime import date as dt_date
from typing import Optional, Union

class ExpenseBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: Union[dt_date, None] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int

    model_config = {
        "from_attributes": True
    }
