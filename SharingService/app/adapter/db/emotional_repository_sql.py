from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List
import uuid

from app.domain.repositories.emotional_repository import EmotionalRepository
from app.domain.entities.emotional_report import EmotionalReport
from app.adapter.db.models import EmotionalReportModel, EmotionalStatus

class SQLEmotionalRepository(EmotionalRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, report: EmotionalReport) -> EmotionalReport:
        # 1. Buscar el ID del estado basado en el nombre (Ej: "happy")
        status_db = self.db.query(EmotionalStatus).filter(EmotionalStatus.name == report.status_name).first()
        
        if not status_db:
            # Opción A: Crear el estado si no existe (Dinámico)
            status_db = EmotionalStatus(name=report.status_name)
            self.db.add(status_db)
            self.db.flush() # Para obtener el ID generado
            # Opción B: Lanzar error si envían un estado no válido (Más estricto)
            # raise ValueError(f"Estado emocional '{report.status_name}' no existe")

        # 2. Crear el reporte con la FK
        db_report = EmotionalReportModel(
            id=report.id,
            user_id=report.user_id,
            user_name=report.user_name,
            group_id=report.group_id,
            status_id=status_db.id,
            created_at=report.created_at
        )
        self.db.add(db_report)
        self.db.commit()
        self.db.refresh(db_report)
        
        report.id = db_report.id
        return report

    def get_latest_moods_by_group(self, group_id: uuid.UUID) -> List[EmotionalReport]:
        # Subconsulta para obtener la última fecha
        subquery = (
            self.db.query(
                EmotionalReportModel.user_id,
                func.max(EmotionalReportModel.created_at).label("max_date")
            )
            .filter(EmotionalReportModel.group_id == group_id)
            .group_by(EmotionalReportModel.user_id)
            .subquery()
        )

        # Hacemos JOIN con la tabla de Status para obtener el nombre ("happy")
        query = (
            self.db.query(EmotionalReportModel)
            .options(joinedload(EmotionalReportModel.status_rel)) 
            .join(subquery, 
                  (EmotionalReportModel.user_id == subquery.c.user_id) & 
                  (EmotionalReportModel.created_at == subquery.c.max_date))
        )
        
        results = query.all()
        return [self._map_to_entity(r) for r in results]

    def _map_to_entity(self, model: EmotionalReportModel) -> EmotionalReport:
        name_display = model.user_name if model.user_name else "Usuario"
        return EmotionalReport(
            id=model.id,
            user_id=model.user_id,
            group_id=model.group_id,
            status_name=model.status_rel.name, 
            created_at=model.created_at,
            user_name=name_display
        )