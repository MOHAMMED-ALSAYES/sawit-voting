import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from app.database.session import Base

class CompetitionStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    CLOSED = "closed"
    COMPLETED = "completed"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    audit_logs = relationship("AuditLog", back_populates="admin")

class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    start_at = Column(DateTime, nullable=False)
    end_at = Column(DateTime, nullable=False)
    status = Column(String(20), default=CompetitionStatus.ACTIVE.value, nullable=False)
    whatsapp_channel_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    participants = relationship("Participant", back_populates="competition", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="competition", cascade="all, delete-orphan")
    winner_results = relationship("WinnerResult", back_populates="competition", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    student_code = Column(String(50), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    participations = relationship("Participant", back_populates="student", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    competition = relationship("Competition", back_populates="participants")
    student = relationship("Student", back_populates="participations")
    votes = relationship("Vote", back_populates="participant", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("competition_id", "student_id", name="uq_competition_student"),
    )

class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True)
    verification_identifier = Column(String(255), unique=True, index=True, nullable=False)
    ip_hash = Column(String(128), nullable=True)
    verification_status = Column(String(50), default="verified", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    votes = relationship("Vote", back_populates="voter")

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)
    voter_id = Column(Integer, ForeignKey("voters.id", ondelete="CASCADE"), nullable=False)
    client_metadata = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    competition = relationship("Competition", back_populates="votes")
    participant = relationship("Participant", back_populates="votes")
    voter = relationship("Voter", back_populates="votes")

    __table_args__ = (
        UniqueConstraint("competition_id", "voter_id", name="uq_competition_voter"),
    )

class WinnerResult(Base):
    __tablename__ = "winner_results"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), nullable=True)
    total_votes = Column(Integer, default=0, nullable=False)
    is_tie = Column(Boolean, default=False, nullable=False)
    tie_details = Column(Text, nullable=True)
    announced_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    announced_by = Column(String(100), nullable=False)

    competition = relationship("Competition", back_populates="winner_results")
    participant = relationship("Participant")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    admin = relationship("Admin", back_populates="audit_logs")

class ContactSetting(Base):
    __tablename__ = "contact_settings"

    id = Column(Integer, primary_key=True, index=True)
    phone_primary = Column(String(50), nullable=True, default="730116384")
    phone_secondary = Column(String(100), nullable=True, default="03-200000")
    whatsapp_number = Column(String(50), nullable=True, default="730116384")
    whatsapp_channel_url = Column(String(500), nullable=True, default="https://whatsapp.com")
    email_primary = Column(String(100), nullable=True, default="cdc.hodeidah@ust.edu.ye")
    email_secondary = Column(String(100), nullable=True)
    facebook_url = Column(String(500), nullable=True, default="https://facebook.com")
    address = Column(String(300), nullable=True, default="اليمن - الحديدة - جامعة العلوم والتكنولوجيا - فرع الحديدة")
    extra_info = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

