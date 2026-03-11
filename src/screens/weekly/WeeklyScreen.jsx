import React, { useState, useEffect, useMemo } from 'react';
import * as Weekly from './styles';
import {WeeklyGrid, ClassDetailModal} from '../../components/weekly/WeeklyComponents';
import LocalStorageHelper from '../../services/localStorage';
import { TIME_SLOTS } from '../../utils/sigaaParser';
import { organizeSchedulesByDay, getVisibleSlots } from '../../utils/horarioUtils';

function WeeklyScreen() {
  const [weekSchedule, setWeekSchedule] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const schedules = LocalStorageHelper.getSchedules();
    setWeekSchedule(organizeSchedulesByDay(schedules));
  }, []);

  // Calculamos os slots apenas quando o horário mudar
  const { visibleSlots, findClass } = useMemo(() => {
    return getVisibleSlots(TIME_SLOTS, weekSchedule);
  }, [weekSchedule]);

  const hasAnySchedule = Object.values(weekSchedule).some(day => day.length > 0);

  return (
    <Weekly.Container>
      <Weekly.Title>Horário Semanal</Weekly.Title>

      {!hasAnySchedule ? (
        <Weekly.EmptyState>
          <p>Nenhum horário carregado.</p>
        </Weekly.EmptyState>
      ) : (
        <WeeklyGrid
          visibleSlots={visibleSlots}
          getClassForSlot={findClass}
          setSelectedClass={setSelectedClass}
        />
      )}

      <ClassDetailModal 
        classItem={selectedClass} 
        onClose={() => setSelectedClass(null)} 
      />
    </Weekly.Container>
  );
}

export default WeeklyScreen;