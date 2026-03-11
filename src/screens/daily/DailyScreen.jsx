import React, { useState, useEffect, useMemo } from 'react';
import * as Daily from './styles';
import LocalStorageHelper from '../../services/localStorage';
import ClassCard from '../../components/daily/DailyComponents';
import { formatLongDate, filterClassesByDay } from '../../utils/horarioUtils';

function DailyScreen() {
  const [schedules, setSchedules] = useState([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    // Apenas carrega os dados brutos uma vez
    const data = LocalStorageHelper.getSchedules();
    setSchedules(data || []);
  }, []);

  // useMemo serve para "recalcular" a lista apenas se o schedules ou a data mudarem
  const todayClasses = useMemo(() => {
    return filterClassesByDay(schedules, currentDate);
  }, [schedules, currentDate]);

  const isFileLoaded = LocalStorageHelper.isFileLoaded();

  return (
    <Daily.Container>
      <Daily.Title>Aulas de Hoje</Daily.Title>
      <Daily.DateDisplay>{formatLongDate(currentDate)}</Daily.DateDisplay>

      {todayClasses.length === 0 ? (
        <Daily.EmptyState>
          <Daily.EmptyIcon>📚</Daily.EmptyIcon>
          <Daily.EmptyText>Nenhuma aula hoje!</Daily.EmptyText>
          {!isFileLoaded && (
            <Daily.EmptySubtext>
              Carregue seu horário através da página SIGAA para visualizar suas aulas.
            </Daily.EmptySubtext>
          )}
        </Daily.EmptyState>
      ) : (
        todayClasses.map((classItem, index) => (
          // <Daily.ClassCard key={`${classItem.subject}-${index}`}>
          //   <Daily.ClassTime>
          //     {classItem.startTime} - {classItem.endTime}
          //   </Daily.ClassTime>
          //   <Daily.ClassName>{classItem.subject || 'Disciplina'}</Daily.ClassName>
            
          //   <Daily.ClassDetails>
          //     {classItem.teacher && <div><strong>Professor(a):</strong> {classItem.teacher}</div>}
          //     {classItem.location && <div><strong>Local:</strong> {classItem.location}</div>}
          //     {classItem.type && <div><strong>Tipo:</strong> {classItem.type}</div>}
          //   </Daily.ClassDetails>
          // </Daily.ClassCard>

          <ClassCard key={`${classItem.subject}-${index}`} classItem={classItem} />

          

        ))
      )}
    </Daily.Container>
  );
}

export default DailyScreen;