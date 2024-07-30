from dotenv import load_dotenv
load_dotenv()
from typing import List
from fastapi import FastAPI, Depends, Response, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import models
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router_v1 = APIRouter(prefix='/api/v1')
router_v2 = APIRouter(prefix='/api/v2')


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# https://fastapi.tiangolo.com/tutorial/sql-databases/#crud-utils


#book
@router_v1.get('/books')
async def get_books(db: Session = Depends(get_db)):
    return db.query(models.Book).all()

@router_v1.get('/books/{book_id}')
async def get_book(book_id: int, db: Session = Depends(get_db)):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

@router_v1.post('/books')
async def create_book(book: dict, response: Response, db: Session = Depends(get_db)):
    # TODO: Add validation
    newbook = models.Book(title=book['title'], author=book['author'], year=book['year'], is_published=book['is_published'], description=book['description'], synopsis=book['synopsis'], category=book['category'])
    db.add(newbook)
    db.commit()
    db.refresh(newbook)
    response.status_code = 201
    return newbook

@router_v1.patch('/books/{book_id}')
async def update_book(book_id: int, book: dict, db: Session = Depends(get_db)):
    update_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    update_book.title = book['title']
    update_book.author = book['author']
    update_book.year = book['year']
    update_book.is_published = book['is_published']
    update_book.description = book['description']
    update_book.synopsis = book['synopsis']
    update_book.category = book['category']
    db.commit()
    db.refresh(update_book)
    Response.status_code = 200
    return update_book

@router_v1.delete('/books/{book_id}')
async def delete_book(book_id: int, response: Response, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    db.delete(book)
    db.commit()
    response.status_code = 204
    return

# @router_v1.patch('/books/{book_id}')
# async def update_book(book_id: int, book: dict, db: Session = Depends(get_db)):
#     pass

# @router_v1.delete('/books/{book_id}')
# async def delete_book(book_id: int, db: Session = Depends(get_db)):
#     pass



#students
@router_v1.get('/students')
async def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@router_v1.get('/students/{student_id}')
async def get_student(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

@router_v1.post('/students')
async def create_student(student: dict, response: Response, db: Session = Depends(get_db)):
    # TODO: Add validation
    newstudent = models.Student(name=student['name'], lastname=student['lastname'], dob=student['dob'], sex=student['sex'])
    db.add(newstudent)
    db.commit()
    db.refresh(newstudent)
    response.status_code = 201
    return newstudent

@router_v1.patch('/students/{student_id}')
async def update_student(student_id: int, student: dict, db: Session = Depends(get_db)):
    update_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    update_student.name = student['name']
    update_student.lastname = student['lastname']
    update_student.dob = student['dob']
    update_student.sex = student['sex']
    db.commit()
    db.refresh(update_student)
    Response.status_code = 200
    return update_student

@router_v1.delete('/students/{student_id}')
async def delete_student(student_id: int, response: Response, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    db.delete(student)
    db.commit()
    response.status_code = 204
    return


#cafe
@router_v1.get('/menu')
async def get_menu(db: Session = Depends(get_db)):
    return db.query(models.Menu).all()

@router_v1.get('/menu/{menu_id}')
async def get_menu(menu_id: int, db: Session = Depends(get_db)):
    return db.query(models.Menu).filter(models.Menu.id == menu_id).first()

@router_v1.post('/menu')
async def create_menu(menu: dict, response: Response, db: Session = Depends(get_db)):
    # TODO: Add validation
    newmenu = models.Menu(name=menu['name'], price=menu['price'], description=menu['description'])
    db.add(newmenu)
    db.commit()
    db.refresh(newmenu)
    response.status_code = 201
    return newmenu

@router_v1.patch('/menu/{menu_id}')
async def update_menu(menu_id: int, menu: dict, db: Session = Depends(get_db)):
    update_menu = db.query(models.Menu).filter(models.Menu.id == menu_id).first()
    update_menu.name = menu['name']
    update_menu.price = menu['price']
    update_menu.description = menu['description']
    db.commit()
    db.refresh(update_menu)
    Response.status_code = 200
    return update_menu

@router_v1.delete('/menu/{menu_id}')
async def delete_menu(menu_id: int, response: Response, db: Session = Depends(get_db)):
    menu = db.query(models.Menu).filter(models.Menu.id == menu_id).first()
    db.delete(menu)
    db.commit()
    response.status_code = 204
    return


# order
@router_v1.get("/order/{order_id}")
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = (
        db.query(models.Order)
        .filter(models.Order.id == order_id)
        .first()

    )

    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.menu=db.query(models.Menu).filter(models.Menu.id== db_order.menu_id).first()
    return {
        "id":db_order.id,
        "menu_id":db_order.menu_id,
        "quantity":db_order.quantity,
        "status":db_order.status,
        "note":db_order.note,
        "menu_name":db_order.menu.name,
    }


@router_v1.get("/order")
def get_order(db: Session = Depends(get_db)):
    order = db.query(models.Order).join(models.Menu).all()
    order_responses = []
    for order in order:
        order_responses.append(
            {
                "id":order.id,
                "menu_id":order.menu_id,
                "quantity":order.quantity,
                "status":order.status,
                "note":order.note,
                "menu_name":order.menu.name
            }
        )
    return order_responses


@router_v1.post("/order")
def create_order(
    order: models.OrderCreate, response: Response, db: Session = Depends(get_db)
):
    print(order)
    db_coffee = (
        db.query(models.Menu).filter(models.Menu.id == order.menu_id).first()
    )
    if db_coffee is None:
        raise HTTPException(status_code=404, detail="Menu not found")

    db_order = models.Order(
        menu_id=order.menu_id, quantity=order.quantity, note=order.note
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    response.status_code = 200
    return db_order


@router_v1.patch("/order/{order_id}")
async def patch_order(
    order_id: int,
    order: models.OrderUpdate,
    db: Session = Depends(get_db),
):
    print(order)
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = order.dict(exclude_unset=True)
    for key, value in order_data.items():
        setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)

    return db_order


@router_v1.delete("/order/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"detail": "Order deleted"}

app.include_router(router_v1)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)