from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Student, Admin, Participant
from app.schemas.schemas import StudentCreate, StudentOut
from app.security.deps import get_current_admin
from app.services.audit import log_action

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("", response_model=List[StudentOut])
def get_students(
    search: str = "",
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    query = db.query(Student)
    if search:
        query = query.filter(Student.full_name.ilike(f"%{search}%"))
    return query.order_by(Student.full_name.asc()).all()

@router.post("", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    student = Student(full_name=student_in.full_name.strip(), student_code=student_in.student_code)
    db.add(student)
    db.commit()
    db.refresh(student)
    log_action(db, action="إضافة طالب جديد", entity_type="Student", entity_id=student.id, admin_id=current_admin.id, details=student.full_name)
    return student

@router.put("/{id}", response_model=StudentOut)
def update_student(
    id: int,
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="الطالب غير موجود")
    student.full_name = student_in.full_name.strip()
    student.student_code = student_in.student_code
    db.commit()
    db.refresh(student)
    log_action(db, action="تعديل بيانات طالب", entity_type="Student", entity_id=student.id, admin_id=current_admin.id)
    return student

@router.delete("/{id}")
def delete_student(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="الطالب غير موجود")
    
    parts_count = db.query(Participant).filter(Participant.student_id == id).count()
    if parts_count > 0:
        raise HTTPException(status_code=400, detail="لا يمكن حذف طالب مرتبط بمسابقات حالية")
    
    db.delete(student)
    db.commit()
    log_action(db, action="حذف طالب", entity_type="Student", entity_id=id, admin_id=current_admin.id)
    return {"message": "تم حذف الطالب بنجاح"}

