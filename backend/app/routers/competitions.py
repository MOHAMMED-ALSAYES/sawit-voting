from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.models import Competition, Participant, Student, Vote, WinnerResult, Admin
from app.schemas.schemas import (
    CompetitionCreate,
    CompetitionUpdate,
    CompetitionOut,
    ParticipantCreate,
    ParticipantOut,
    StudentCreate,
    StudentOut
)
from app.security.deps import get_current_admin
from app.services.audit import log_action

router = APIRouter(prefix="/competitions", tags=["Competitions"])

@router.get("", response_model=List[CompetitionOut])
def get_competitions(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comps = db.query(Competition).order_by(Competition.created_at.desc()).all()
    results = []
    for c in comps:
        p_count = db.query(Participant).filter(Participant.competition_id == c.id).count()
        v_count = db.query(Vote).filter(Vote.competition_id == c.id).count()
        results.append(
            CompetitionOut(
                id=c.id,
                title=c.title,
                slug=c.slug,
                description=c.description,
                start_at=c.start_at,
                end_at=c.end_at,
                status=c.status,
                whatsapp_channel_url=c.whatsapp_channel_url,
                created_at=c.created_at,
                updated_at=c.updated_at,
                participant_count=p_count,
                total_votes=v_count
            )
        )
    return results

@router.post("", response_model=CompetitionOut, status_code=status.HTTP_201_CREATED)
def create_competition(
    comp_in: CompetitionCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    existing = db.query(Competition).filter(Competition.slug == comp_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="الاسم التعريفي (Slug) مستخدم مسبقاً لمسابقة أخرى")
    
    comp = Competition(
        title=comp_in.title,
        slug=comp_in.slug,
        description=comp_in.description,
        start_at=comp_in.start_at,
        end_at=comp_in.end_at,
        status=comp_in.status,
        whatsapp_channel_url=comp_in.whatsapp_channel_url
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    log_action(db, action="إنشاء مسابقة جديدة", entity_type="Competition", entity_id=comp.id, admin_id=current_admin.id, details=comp.title)
    return CompetitionOut(
        id=comp.id,
        title=comp.title,
        slug=comp.slug,
        description=comp.description,
        start_at=comp.start_at,
        end_at=comp.end_at,
        status=comp.status,
        whatsapp_channel_url=comp.whatsapp_channel_url,
        created_at=comp.created_at,
        updated_at=comp.updated_at,
        participant_count=0,
        total_votes=0
    )

@router.get("/{id}", response_model=CompetitionOut)
def get_competition(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    p_count = db.query(Participant).filter(Participant.competition_id == comp.id).count()
    v_count = db.query(Vote).filter(Vote.competition_id == comp.id).count()
    return CompetitionOut(
        id=comp.id,
        title=comp.title,
        slug=comp.slug,
        description=comp.description,
        start_at=comp.start_at,
        end_at=comp.end_at,
        status=comp.status,
        whatsapp_channel_url=comp.whatsapp_channel_url,
        created_at=comp.created_at,
        updated_at=comp.updated_at,
        participant_count=p_count,
        total_votes=v_count
    )

@router.put("/{id}", response_model=CompetitionOut)
def update_competition(
    id: int,
    comp_update: CompetitionUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    update_data = comp_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(comp, key, value)
    
    db.commit()
    db.refresh(comp)
    log_action(db, action="تعديل بيانات المسابقة", entity_type="Competition", entity_id=comp.id, admin_id=current_admin.id)
    p_count = db.query(Participant).filter(Participant.competition_id == comp.id).count()
    v_count = db.query(Vote).filter(Vote.competition_id == comp.id).count()
    return CompetitionOut(
        id=comp.id,
        title=comp.title,
        slug=comp.slug,
        description=comp.description,
        start_at=comp.start_at,
        end_at=comp.end_at,
        status=comp.status,
        whatsapp_channel_url=comp.whatsapp_channel_url,
        created_at=comp.created_at,
        updated_at=comp.updated_at,
        participant_count=p_count,
        total_votes=v_count
    )

@router.post("/{id}/close", response_model=CompetitionOut)
def close_competition(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    comp.status = "closed"
    db.commit()
    db.refresh(comp)
    log_action(db, action="إغلاق التصويت في المسابقة", entity_type="Competition", entity_id=comp.id, admin_id=current_admin.id)
    p_count = db.query(Participant).filter(Participant.competition_id == comp.id).count()
    v_count = db.query(Vote).filter(Vote.competition_id == comp.id).count()
    return CompetitionOut(
        id=comp.id,
        title=comp.title,
        slug=comp.slug,
        description=comp.description,
        start_at=comp.start_at,
        end_at=comp.end_at,
        status=comp.status,
        whatsapp_channel_url=comp.whatsapp_channel_url,
        created_at=comp.created_at,
        updated_at=comp.updated_at,
        participant_count=p_count,
        total_votes=v_count
    )

@router.delete("/{id}")
def delete_competition(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    votes_count = db.query(Vote).filter(Vote.competition_id == id).count()
    if votes_count > 0:
        raise HTTPException(
            status_code=400,
            detail="لا يمكن حذف مسابقة تحتوي على أصوات فعلية مسجلة؛ يمكنك إغلاقها بدلاً من ذلك لحفظ السجلات."
        )
    
    title = comp.title
    db.delete(comp)
    db.commit()
    log_action(db, action="حذف مسابقة", entity_type="Competition", entity_id=id, admin_id=current_admin.id, details=title)
    return {"message": "تم حذف المسابقة بنجاح"}

# Students & Participants Management
@router.get("/{id}/participants", response_model=List[ParticipantOut])
def get_competition_participants(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    return comp.participants

@router.post("/{id}/participants", response_model=ParticipantOut)
def add_participant_to_competition(
    id: int,
    p_in: ParticipantCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    student = db.query(Student).filter(Student.id == p_in.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="الطالب غير موجود في النظام")
    
    existing = db.query(Participant).filter(
        Participant.competition_id == id,
        Participant.student_id == p_in.student_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="هذا الطالب مضاف بالفعل في هذه المسابقة")
    
    participant = Participant(competition_id=id, student_id=p_in.student_id)
    db.add(participant)
    db.commit()
    db.refresh(participant)
    log_action(db, action="إضافة مشارك للمسابقة", entity_type="Participant", entity_id=participant.id, admin_id=current_admin.id, details=f"طالب: {student.full_name} في {comp.title}")
    return participant

@router.delete("/participants/{participant_id}")
def remove_participant(
    participant_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="المشارك غير موجود")
    
    votes_count = db.query(Vote).filter(Vote.participant_id == participant_id).count()
    if votes_count > 0:
        raise HTTPException(status_code=400, detail="لا يمكن حذف مشارك لديه أصوات مسجلة")
    
    db.delete(participant)
    db.commit()
    log_action(db, action="حذف مشارك من مسابقة", entity_type="Participant", entity_id=participant_id, admin_id=current_admin.id)
    return {"message": "تم حذف المشارك بنجاح"}

