from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    admin_name: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str

class AdminProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class AdminOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Competition Schemas
class CompetitionBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    start_at: datetime
    end_at: datetime
    status: str = "active"
    whatsapp_channel_url: str

class CompetitionCreate(CompetitionBase):
    pass

class CompetitionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    status: Optional[str] = None
    whatsapp_channel_url: Optional[str] = None

class CompetitionOut(CompetitionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    participant_count: Optional[int] = 0
    total_votes: Optional[int] = 0
    class Config:
        from_attributes = True

# Public Competition Out (Strictly NO votes or rankings)
class PublicCompetitionOut(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    start_at: datetime
    end_at: datetime
    status: str
    whatsapp_channel_url: str
    class Config:
        from_attributes = True

# Student & Participant Schemas
class StudentBase(BaseModel):
    full_name: str
    student_code: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentOut(StudentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ParticipantCreate(BaseModel):
    student_id: int

class ParticipantOut(BaseModel):
    id: int
    competition_id: int
    student_id: int
    student: StudentOut
    created_at: datetime
    class Config:
        from_attributes = True

# Public Participant Out (NO votes, NO percentages)
class PublicParticipantOut(BaseModel):
    id: int
    student_id: int
    full_name: str
    class Config:
        from_attributes = True

# Voting Schemas
class VoteSubmit(BaseModel):
    competition_id: int
    participant_id: int
    voter_identifier: str
    metadata: Optional[str] = None

class VoteResponse(BaseModel):
    success: bool
    message: str
    already_voted: bool = False

# Results & Admin Ranking
class ParticipantResultOut(BaseModel):
    participant_id: int
    student_id: int
    student_name: str
    total_votes: int
    percentage: float
    rank: int

class CompetitionResultsOut(BaseModel):
    competition_id: int
    title: str
    total_votes: int
    participants: List[ParticipantResultOut]
    is_tie: bool
    tie_candidates: List[ParticipantResultOut] = []

class WinnerAnnounceRequest(BaseModel):
    pass

class WinnerAnnounceOut(BaseModel):
    competition_id: int
    winner_name: Optional[str] = None
    winner_participant_id: Optional[int] = None
    total_votes: int
    is_tie: bool
    tie_message: Optional[str] = None
    announced_at: datetime
    announced_by: str

# Audit Log
class AuditLogOut(BaseModel):
    id: int
    admin_id: Optional[int]
    action: str
    entity_type: str
    entity_id: Optional[int]
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# Contact Channels & Info
class ContactSettingBase(BaseModel):
    phone_primary: Optional[str] = "730116384"
    phone_secondary: Optional[str] = "03-200000"
    whatsapp_number: Optional[str] = "730116384"
    whatsapp_channel_url: Optional[str] = "https://whatsapp.com"
    email_primary: Optional[str] = "cdc.hodeidah@ust.edu.ye"
    email_secondary: Optional[str] = None
    facebook_url: Optional[str] = "https://facebook.com"
    address: Optional[str] = "اليمن - الحديدة - جامعة العلوم والتكنولوجيا - فرع الحديدة"
    extra_info: Optional[str] = None

class ContactSettingUpdate(BaseModel):
    phone_primary: Optional[str] = None
    phone_secondary: Optional[str] = None
    whatsapp_number: Optional[str] = None
    whatsapp_channel_url: Optional[str] = None
    email_primary: Optional[str] = None
    email_secondary: Optional[str] = None
    facebook_url: Optional[str] = None
    address: Optional[str] = None
    extra_info: Optional[str] = None

class ContactSettingOut(ContactSettingBase):
    id: int
    updated_at: datetime
    class Config:
        from_attributes = True

