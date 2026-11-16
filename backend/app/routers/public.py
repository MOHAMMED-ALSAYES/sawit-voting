from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Competition, Participant, ContactSetting
from app.schemas.schemas import PublicCompetitionOut, PublicParticipantOut, ContactSettingOut

router = APIRouter(prefix="/public", tags=["Public API"])

@router.get("/contact-info", response_model=ContactSettingOut)
def get_public_contact_info(db: Session = Depends(get_db)):
    contact = db.query(ContactSetting).first()
    if not contact:
        contact = ContactSetting(
            phone_primary="730116384",
            phone_secondary="03-200000",
            whatsapp_number="730116384",
            whatsapp_channel_url="https://whatsapp.com",
            email_primary="cdc.hodeidah@ust.edu.ye",
            facebook_url="https://facebook.com",
            address="اليمن - الحديدة - جامعة العلوم والتكنولوجيا - فرع الحديدة"
        )
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact

@router.get("/competitions", response_model=List[PublicCompetitionOut])
def get_all_public_competitions(db: Session = Depends(get_db)):
    # جلب جميع المسابقات النشطة أو المتاحة للتصويت تلقائياً
    comps = (
        db.query(Competition)
        .filter(Competition.status.in_(["active", "scheduled"]))
        .order_by(Competition.created_at.desc())
        .all()
    )
    return comps

@router.get("/competitions/{slug}", response_model=PublicCompetitionOut)
def get_public_competition(slug: str, db: Session = Depends(get_db)):
    comp = db.query(Competition).filter(Competition.slug == slug).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    return comp

@router.get("/competitions/{slug}/participants", response_model=List[PublicParticipantOut])
def get_public_participants(slug: str, db: Session = Depends(get_db)):
    comp = db.query(Competition).filter(Competition.slug == slug).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    participants = (
        db.query(Participant)
        .filter(Participant.competition_id == comp.id)
        .all()
    )
    
    return [
        PublicParticipantOut(
            id=p.id,
            student_id=p.student.id,
            full_name=p.student.full_name
        )
        for p in participants
    ]
