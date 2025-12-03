from abc import ABC, abstractmethod
from typing import List
import uuid
from app.domain.entities.emotional_report import EmotionalReport

class EmotionalRepository(ABC):
    @abstractmethod
    def save(self, report: EmotionalReport) -> EmotionalReport:
        pass

    @abstractmethod
    def get_latest_moods_by_group(self, group_id: uuid.UUID) -> List[EmotionalReport]:
        pass