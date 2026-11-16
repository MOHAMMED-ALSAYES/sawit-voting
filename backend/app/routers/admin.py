from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Admin, Competition, Participant, Student, Vote, AuditLog
from app.schemas.schemas import AdminLogin, Token, AdminOut, AuditLogOut, AdminProfileUpdate, AdminCreate
from app.security.security import verify_password, get_password_hash, create_access_token
from app.security.deps import get_current_admin
from app.services.audit import log_action

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/login", response_model=Token)
def login(login_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == login_data.username.strip()).first()
    if not admin or not verify_password(login_data.password.strip(), admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة المرور غير صحيحة"
        )
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="حساب الإدارة غير نشط"
        )
    
    access_token = create_access_token(subject=admin.id)
    log_action(db, action="تسجيل دخول للإدارة", entity_type="Admin", entity_id=admin.id, admin_id=admin.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin_name": admin.username
    }

@router.get("/me", response_model=AdminOut)
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin

@router.put("/profile", response_model=AdminOut)
def update_profile(
    profile_data: AdminProfileUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    # إذا أراد تغيير كلمة المرور يجب التحقق من كلمة المرور الحالية
    if profile_data.new_password:
        if not profile_data.current_password or not verify_password(profile_data.current_password.strip(), current_admin.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="كلمة المرور الحالية غير صحيحة"
            )
        if len(profile_data.new_password.strip()) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="يجب ألا تقل كلمة المرور الجديدة عن 6 خانات"
            )
        current_admin.password_hash = get_password_hash(profile_data.new_password.strip())

    # تحديث اسم المستخدم
    if profile_data.username and profile_data.username.strip() != current_admin.username:
        new_username = profile_data.username.strip()
        existing = db.query(Admin).filter(Admin.username == new_username, Admin.id != current_admin.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="اسم المستخدم الجديد محجوز مسبقاً"
            )
        current_admin.username = new_username

    # تحديث البريد الإلكتروني
    if profile_data.email and profile_data.email.strip() != current_admin.email:
        new_email = profile_data.email.strip()
        existing_email = db.query(Admin).filter(Admin.email == new_email, Admin.id != current_admin.id).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="البريد الإلكتروني الجديد مستخدم مسبقاً"
            )
        current_admin.email = new_email

    db.commit()
    db.refresh(current_admin)
    log_action(db, action="تحديث بيانات حساب الإدارة وكلمة المرور", entity_type="Admin", entity_id=current_admin.id, admin_id=current_admin.id)
    return current_admin

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    total_competitions = db.query(Competition).count()
    active_competitions = db.query(Competition).filter(Competition.status == "active").count()
    total_students = db.query(Student).count()
    total_votes = db.query(Vote).count()

    latest_logs = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "stats": {
            "total_competitions": total_competitions,
            "active_competitions": active_competitions,
            "total_students": total_students,
            "total_votes": total_votes,
        },
        "latest_logs": [
            {
                "id": log.id,
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "details": log.details,
                "created_at": log.created_at.isoformat()
            }
            for log in latest_logs
        ]
    }

@router.get("/audit-logs", response_model=list[AuditLogOut])
def get_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs
