from abc import ABC, abstractmethod
from app.domain.entities.group import Group
from app.domain.entities.activity import Activity
import uuid
from typing import List

class GroupRepository(ABC):
    @abstractmethod
    def save(self, group: Group) -> Group:
        pass

    @abstractmethod
    def find_by_id(self, group_id: uuid.UUID) -> Group | None:
        pass

    @abstractmethod
    def find_by_invite_code(self, code: str) -> Group | None:
        pass

    @abstractmethod
    def update_name(self, group_id: uuid.UUID, name: str) -> Group | None:
        pass

    @abstractmethod
    def delete(self, group_id: uuid.UUID) -> bool:
        pass

    @abstractmethod
    def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role: str):
        pass

    @abstractmethod
    def get_member(self, group_id: uuid.UUID, user_id: uuid.UUID):
        pass

    @abstractmethod
    def list_members(self, group_id: uuid.UUID):
        pass

    @abstractmethod
    def update_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role=None, is_sharing_location_with_group=None, has_notifications_enabled=None):
        pass

    @abstractmethod
    def remove_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        pass

    @abstractmethod
    def is_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        pass

    @abstractmethod
    def find_groups_by_user_id(self, user_id: uuid.UUID) -> List[Group]:
        pass

    @abstractmethod
    def save_activity(self, activity: Activity) -> Activity:
        pass

    @abstractmethod
    def find_activity_by_id(self, activity_id: uuid.UUID) -> Activity | None:
        pass

    @abstractmethod
    def list_activities_by_group(self, group_id: uuid.UUID) -> List[Activity]:
        pass

    @abstractmethod
    def update_activity(self, activity_id: uuid.UUID, title=None, description=None, start_date=None, end_date=None, xp_reward=None, status=None) -> Activity | None:
        pass

    @abstractmethod
    def delete_activity(self, activity_id: uuid.UUID) -> bool:
        pass