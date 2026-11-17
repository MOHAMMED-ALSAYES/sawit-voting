from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Competition, Participant, ContactSetting
from app.schemas.schemas import PublicCompetitionOut, PublicParticipantOut, ContactSettingOut

router = APIRouter(prefix="/public", tags=["Public API"])

@router.get("/contact-info", response_model=ContactSettingOut)
def get_public_contact_info(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
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
def get_all_public_competitions(response: Response, db: Session = Depends(get_db)):
    # Cache at Vercel Edge for high-speed public access
    response.headers["Cache-Control"] = "public, max-age=10, s-maxage=20, stale-while-revalidate=60"
    comps = (
        db.query(Competition)
        .filter(Competition.status.in_(["active", "scheduled"]))
        .order_by(Competition.created_at.desc())
        .all()
    )
    return comps

@router.get("/competitions/{slug}", response_model=PublicCompetitionOut)
def get_public_competition(slug: str, response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=10, s-maxage=20, stale-while-revalidate=60"
    comp = db.query(Competition).filter(Competition.slug == slug).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    return comp

@router.get("/competitions/{slug}/participants", response_model=List[PublicParticipantOut])
def get_public_participants(slug: str, response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=10, s-maxage=20, stale-while-revalidate=60"
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
