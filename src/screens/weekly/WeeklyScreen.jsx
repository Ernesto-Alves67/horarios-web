import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Weekly from './styles';
import {WeeklyGrid, ClassDetailModal, WeeklyHeader} from '../../components/weekly/WeeklyComponents';
import LocalStorageHelper from '../../services/localStorage';
import { TIME_SLOTS } from '../../utils/sigaaParser';
import { organizeSchedulesByDay, getVisibleSlots } from '../../utils/horarioUtils';

function WeeklyScreen() {
  const [weekSchedule, setWeekSchedule] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const schedules = LocalStorageHelper.getSchedules();
    setWeekSchedule(organizeSchedulesByDay(schedules));
    // setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  // Calculamos os slots apenas quando o horário mudar
  const { visibleSlots, findClass } = useMemo(() => {
    return getVisibleSlots(TIME_SLOTS, weekSchedule);
  }, [weekSchedule]);

  const hasAnySchedule = Object.values(weekSchedule).some(day => day.length > 0);

  return (
    <>  
        <WeeklyHeader/> 
        <Weekly.Container>

          {!hasAnySchedule ? (
            <Weekly.EmptyState>
              <p>Nenhum horário carregado.</p>
            </Weekly.EmptyState>
          ) : (
            <>    
              <WeeklyGrid
                visibleSlots={visibleSlots}
                getClassForSlot={findClass}
                setSelectedClass={setSelectedClass}
              />
            </>
          )}

          <ClassDetailModal 
            classItem={selectedClass} 
            onClose={() => setSelectedClass(null)} 
          />
        </Weekly.Container>
    </>

  );
}

export default WeeklyScreen;