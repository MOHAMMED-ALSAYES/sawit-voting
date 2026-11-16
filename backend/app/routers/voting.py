from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database.session import get_db
from app.models.models import Competition, Participant, Voter, Vote
from app.schemas.schemas import VoteSubmit, VoteResponse

router = APIRouter(prefix="/voting", tags=["Voting Engine"])

@router.post("/submit", response_model=VoteResponse)
def submit_vote(
    vote_data: VoteSubmit,
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. التحقق من وجود المسابقة وحالتها وتاريخها
    competition = db.query(Competition).filter(Competition.id == vote_data.competition_id).first()
    if not competition:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    now = datetime.utcnow()
    if competition.status != "active":
        return VoteResponse(success=False, message="التصويت مغلق لهذه المسابقة حالياً", already_voted=False)
    
    if now < competition.start_at:
        return VoteResponse(success=False, message="لم تبدأ فترة التصويت لهذه المسابقة بعد", already_voted=False)
        
    if now > competition.end_at:
        return VoteResponse(success=False, message="انتهت فترة التصويت لهذه المسابقة", already_voted=False)

    # 2. التحقق من أن المشارك يتبع المسابقة فعلياً
    participant = db.query(Participant).filter(
        Participant.id == vote_data.participant_id,
        Participant.competition_id == competition.id
    ).first()
    if not participant:
        raise HTTPException(status_code=400, detail="المشارك المختار لا ينتمي إلى هذه المسابقة")

    # 3. استخراج وتأمين هوية المصوّت
    identifier = vote_data.voter_identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="معرف المصوت غير صحيح أو مفقود")

    client_ip = request.client.host if request.client else "unknown"

    # البحث عن المصوت أو تسجيله
    voter = db.query(Voter).filter(Voter.verification_identifier == identifier).first()
    if not voter:
        voter = Voter(
            verification_identifier=identifier,
            ip_hash=client_ip,
            verification_status="verified"
        )
        db.add(voter)
        db.flush()

    # 4. التحقق الصارم في قاعدة البيانات من عدم التصويت مسبقاً في هذه المسابقة
    existing_vote = db.query(Vote).filter(
        Vote.competition_id == competition.id,
        Vote.voter_id == voter.id
    ).first()

    if existing_vote:
        return VoteResponse(
            success=False,
            message="لقد شاركت في التصويت مسبقاً، شكراً لمشاركتك.",
            already_voted=True
        )

    # 5. تسجيل الصوت داخل Transaction محمية
    try:
        new_vote = Vote(
            competition_id=competition.id,
            participant_id=participant.id,
            voter_id=voter.id,
            client_metadata=vote_data.metadata
        )
        db.add(new_vote)
        db.commit()
    except IntegrityError:
        db.rollback()
        return VoteResponse(
            success=False,
            message="لقد شاركت في التصويت مسبقاً، شكراً لمشاركتك.",
            already_voted=True
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="حدث خطأ غير متوقع أثناء تسجيل الصوت")

    return VoteResponse(
        success=True,
        message="تم تسجيل صوتك بنجاح! شكراً لمشاركتك في مسابقة المركز التعليمي.",
        already_voted=False
    )

@router.get("/status")
def check_vote_status(
    competition_id: int,
    voter_identifier: str,
    db: Session = Depends(get_db)
):
    voter = db.query(Voter).filter(Voter.verification_identifier == voter_identifier.strip()).first()
    if not voter:
        return {"has_voted": False}
    
    existing_vote = db.query(Vote).filter(
        Vote.competition_id == competition_id,
        Vote.voter_id == voter.id
    ).first()
    
    return {"has_voted": existing_vote is not None}

