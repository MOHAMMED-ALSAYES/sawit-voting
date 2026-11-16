from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.models import Competition, Participant, Student, Vote, WinnerResult, Admin
from app.schemas.schemas import CompetitionResultsOut, ParticipantResultOut, WinnerAnnounceOut
from app.security.deps import get_current_admin
from app.services.audit import log_action

router = APIRouter(prefix="/admin/competitions", tags=["Admin Results & Winner"])

@router.get("/{id}/results", response_model=CompetitionResultsOut)
def get_competition_results(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")

    total_votes = db.query(Vote).filter(Vote.competition_id == id).count()

    # استخراج الأصوات لكل مشارك
    participants = db.query(Participant).filter(Participant.competition_id == id).all()
    results = []
    
    for p in participants:
        v_count = db.query(Vote).filter(Vote.participant_id == p.id).count()
        pct = (v_count / total_votes * 100) if total_votes > 0 else 0.0
        results.append({
            "participant_id": p.id,
            "student_id": p.student.id,
            "student_name": p.student.full_name,
            "total_votes": v_count,
            "percentage": round(pct, 2)
        })

    # ترتيب النتائج من الأعلى للأدنى
    results.sort(key=lambda x: x["total_votes"], reverse=True)

    # احتساب الترتيب ومعالجة التعادلات
    ranked_results = []
    for idx, item in enumerate(results, start=1):
        ranked_results.append(
            ParticipantResultOut(
                participant_id=item["participant_id"],
                student_id=item["student_id"],
                student_name=item["student_name"],
                total_votes=item["total_votes"],
                percentage=item["percentage"],
                rank=idx
            )
        )

    # فحص التعادل في المركز الأول
    is_tie = False
    tie_candidates = []
    if len(ranked_results) >= 2 and total_votes > 0:
        top_votes = ranked_results[0].total_votes
        tie_candidates = [r for r in ranked_results if r.total_votes == top_votes]
        if len(tie_candidates) > 1:
            is_tie = True

    return CompetitionResultsOut(
        competition_id=comp.id,
        title=comp.title,
        total_votes=total_votes,
        participants=ranked_results,
        is_tie=is_tie,
        tie_candidates=tie_candidates if is_tie else []
    )

@router.post("/{id}/announce-winner", response_model=WinnerAnnounceOut)
def announce_winner(
    id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    comp = db.query(Competition).filter(Competition.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="المسابقة غير موجودة")
    
    # يجب أن تكون المسابقة مغلقة
    if comp.status != "closed" and comp.status != "completed":
        raise HTTPException(
            status_code=400,
            detail="يجب إغلاق المسابقة أولاً قبل إعلان النتائج الرسمية"
        )

    total_votes = db.query(Vote).filter(Vote.competition_id == id).count()
    if total_votes == 0:
        raise HTTPException(
            status_code=400,
            detail="لا يمكن إعلان فائز في مسابقة بدون أي أصوات مسجلة"
        )

    # احتساب الأصوات
    participants = db.query(Participant).filter(Participant.competition_id == id).all()
    results = []
    for p in participants:
        v_count = db.query(Vote).filter(Vote.participant_id == p.id).count()
        results.append((p, v_count))

    results.sort(key=lambda x: x[1], reverse=True)
    top_participant, top_votes = results[0]

    # التحقق من التعادل
    ties = [p for p, v in results if v == top_votes]
    if len(ties) > 1:
        # تسجيل حالة التعادل
        tie_names = ", ".join([p.student.full_name for p in ties])
        tie_record = WinnerResult(
            competition_id=comp.id,
            participant_id=None,
            total_votes=top_votes,
            is_tie=True,
            tie_details=f"تعادل بين الطلاب: {tie_names}",
            announced_at=datetime.utcnow(),
            announced_by=current_admin.username
        )
        db.add(tie_record)
        db.commit()
        log_action(db, action="تسجيل حالة تعادل في النتائج", entity_type="WinnerResult", entity_id=comp.id, admin_id=current_admin.id, details=tie_names)
        return WinnerAnnounceOut(
            competition_id=comp.id,
            winner_name=None,
            winner_participant_id=None,
            total_votes=top_votes,
            is_tie=True,
            tie_message=f"يوجد تعادل في المركز الأول بين: {tie_names} بـ {top_votes} صوت لكل منهم. يرجى حسم التعادل وفق سياسة المركز.",
            announced_at=tie_record.announced_at,
            announced_by=current_admin.username
        )

    # اعتماد الفائز الصريح
    winner_record = WinnerResult(
        competition_id=comp.id,
        participant_id=top_participant.id,
        total_votes=top_votes,
        is_tie=False,
        tie_details=None,
        announced_at=datetime.utcnow(),
        announced_by=current_admin.username
    )
    comp.status = "completed"
    db.add(winner_record)
    db.commit()
    db.refresh(winner_record)

    log_action(db, action="اعتماد وإعلان الفائز بالمسابقة", entity_type="WinnerResult", entity_id=comp.id, admin_id=current_admin.id, details=f"الفائز: {top_participant.student.full_name}")

    return WinnerAnnounceOut(
        competition_id=comp.id,
        winner_name=top_participant.student.full_name,
        winner_participant_id=top_participant.id,
        total_votes=top_votes,
        is_tie=False,
        tie_message=None,
        announced_at=winner_record.announced_at,
        announced_by=current_admin.username
    )

