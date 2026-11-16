from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import AuditLog

def log_action(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
    admin_id: Optional[int] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None
):
    audit_entry = AuditLog(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        ip_address=ip_address
    )
    db.add(audit_entry)
    db.commit()

