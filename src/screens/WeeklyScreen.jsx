import { useState, useEffect } from 'react';
import * as Weekly from '../components/WeeklyComponents';
import LocalStorageHelper from '../services/localStorage';
import { TIME_SLOTS } from '../utils/sigaaParser';



function WeeklyScreen() {
  const [weekSchedule, setWeekSchedule] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    // Carrega os horários do localStorage
    const schedules = LocalStorageHelper.getSchedules();
    if (schedules && schedules.length > 0) {
      // Organiza por dia da semana
      const organized = {
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
      };
      
      schedules.forEach(schedule => {
        const day = schedule.day?.toLowerCase();
        if (organized[day]) {
          organized[day].push(schedule);
        }
      });
      
      // Ordena cada dia por horário
      Object.keys(organized).forEach(day => {
        organized[day].sort((a, b) => {
          const timeA = a.startTime || '00:00';
          const timeB = b.startTime || '00:00';
          return timeA.localeCompare(timeB);
        });
      });
      
      setWeekSchedule(organized);
    }
  }, []);

  const dayNames = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
  };

  const hasAnySchedule = Object.values(weekSchedule).some(day => day.length > 0);

  // Generate flattened slots for Grid View
  const getFlattenedSlots = () => {
    const slots = [];
    ['M', 'T', 'N'].forEach(shift => {
      const shiftSlots = TIME_SLOTS[shift];
      if (shiftSlots) {
        Object.values(shiftSlots).forEach(slot => slots.push(slot));
      }
    });
    return slots;
  };

  const flattenedSlots = getFlattenedSlots();

  const getClassForSlot = (dayKey, slot) => {
    const dayClasses = weekSchedule[dayKey];
    if (!dayClasses) return null;

    return dayClasses.find(cls => {
      return cls.startTime <= slot.start && cls.endTime >= slot.end;
    });
  };

  if (!hasAnySchedule) {
    return (
      <Weekly.Container>
        <Weekly.Title>Semana</Weekly.Title>
        <Weekly.EmptyState>
          <Weekly.EmptyIcon>📅</Weekly.EmptyIcon>
          <Weekly.EmptyText>Nenhum horário cadastrado</Weekly.EmptyText>
          <Weekly.EmptySubtext>
            Carregue seu horário através da página SIGAA para visualizar suas aulas da semana.
          </Weekly.EmptySubtext>
        </Weekly.EmptyState>
      </Weekly.Container>
    );
  }

  return (
    <Weekly.Container>
      <Weekly.HeaderContainer>
        <Weekly.Title style={{ marginBottom: 0 }}>Semana</Weekly.Title>
        <Weekly.ViewToggle>
          <Weekly.ToggleButton 
            $active={viewMode === 'list'} 
            onClick={() => setViewMode('list')}
          >
            Lista
          </Weekly.ToggleButton>
          <Weekly.ToggleButton 
            $active={viewMode === 'grid'} 
            onClick={() => setViewMode('grid')}
          >
            Grade
          </Weekly.ToggleButton>
        </Weekly.ViewToggle>
      </Weekly.HeaderContainer>

      {viewMode === 'list' ? (
        <Weekly.WeekContainer>
          {Object.entries(dayNames).map(([dayKey, dayLabel]) => (
            <Weekly.DayCard key={dayKey}>
              <Weekly.DayHeader>{dayLabel}</Weekly.DayHeader>
              {weekSchedule[dayKey]?.length > 0 ? (
                weekSchedule[dayKey].map((classItem, index) => (
                  <Weekly.ClassItem key={index}>
                    <Weekly.ClassTime>
                      {classItem.startTime} - {classItem.endTime}
                    </Weekly.ClassTime>
                    <Weekly.ClassName>{classItem.subject || 'Disciplina'}</Weekly.ClassName>
                    {classItem.location && (
                      <Weekly.ClassLocation>{classItem.location}</Weekly.ClassLocation>
                    )}
                  </Weekly.ClassItem>
                ))
              ) : (
                <Weekly.EmptyDay>Sem aulas</Weekly.EmptyDay>
              )}
            </Weekly.DayCard>
          ))}
        </Weekly.WeekContainer>
      ) : (
        <Weekly.GridContainer>
          <Weekly.GridTable>
            <Weekly.GridHead>
              <tr>
                {Object.entries(dayNames).map(([key, label]) => (
                  <Weekly.GridHeader key={key}>{label.split('-')[0].substring(0, 3)}</Weekly.GridHeader>
                ))}
              </tr>
            </Weekly.GridHead>
            <tbody>
              {flattenedSlots.map((slot, index) => (
                <tr key={`${slot.label}-${index}`}>
                  {Object.keys(dayNames).map(dayKey => {
                    const classItem = getClassForSlot(dayKey, slot);
                    return (
                      <Weekly.GridCell key={`${dayKey}-${slot.label}`} $hasContent={!!classItem}>
                        {classItem && (
                          <Weekly.GridClassItem 
                            $period={slot.label.charAt(0)}
                            onClick={() => setSelectedClass(classItem)}
                          >
                            {classItem.subject}
                          </Weekly.GridClassItem>
                        )}
                      </Weekly.GridCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Weekly.GridTable>
        </Weekly.GridContainer>
      )}

      {selectedClass && (
        <Weekly.ModalOverlay onClick={() => setSelectedClass(null)}>
          <Weekly.ModalCard onClick={e => e.stopPropagation()}>
            <Weekly.ModalTitle>Detalhes da Aula</Weekly.ModalTitle>
            <Weekly.ModalRow>
              <strong>Disciplina:</strong> {selectedClass.subject}
            </Weekly.ModalRow>
            {selectedClass.location && (
              <Weekly.ModalRow>
                <strong>Local:</strong> {selectedClass.location}
              </Weekly.ModalRow>
            )}
             <Weekly.ModalRow>
              <strong>Horário:</strong> {selectedClass.startTime} - {selectedClass.endTime}
            </Weekly.ModalRow>
            {selectedClass.teacher && (
              <Weekly.ModalRow>
                <strong>Docente:</strong> {selectedClass.teacher}
              </Weekly.ModalRow>
            )}
             {selectedClass.codigo && (
              <Weekly.ModalRow>
                <strong>Código:</strong> {selectedClass.codigo}
              </Weekly.ModalRow>
            )}
             {selectedClass.classCode && (
              <Weekly.ModalRow>
                <strong>Turma:</strong> {selectedClass.classCode}
              </Weekly.ModalRow>
            )}
            <Weekly.ModalCloseButton onClick={() => setSelectedClass(null)}>
              Fechar
            </Weekly.ModalCloseButton>
          </Weekly.ModalCard>
        </Weekly.ModalOverlay>
      )}
    </Weekly.Container>
  );
}

export default WeeklyScreen;
