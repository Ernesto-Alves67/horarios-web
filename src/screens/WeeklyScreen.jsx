import { useState, useEffect } from 'react';
import styled from 'styled-components';
import LocalStorageHelper from '../services/localStorage';
import { TIME_SLOTS } from '../utils/sigaaParser';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.backgroundDark};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 4px;
  gap: 4px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.$active ? props.theme.colors.ufcatGreen : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.$active ? 'white' : props.theme.colors.textPrimary};
  }
`;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DayCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const DayHeader = styled.div`
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.UfcatRed}, ${props.theme.colors.UfcatOrange}, ${props.theme.colors.UfcatOrangeDark})`};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const ClassItem = styled.div`
  background-color: ${props => props.theme.colors.backgroundDark};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-left: 3px solid ${props => props.theme.colors.ufcatGreen};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ClassTime = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.medium};
  margin-bottom: 4px;
`;

const ClassName = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ClassLocation = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyDay = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.fontSize.sm};
  padding: ${props => props.theme.spacing.md} 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmptySubtext = styled.p`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textLight};
`;

// Grid View Components
const GridContainer = styled.div`
  overflow-x: hidden;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xxs};
`;

const GridTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const GridHead = styled.thead`
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.UfcatRed}, ${props.theme.colors.UfcatOrange}, ${props.theme.colors.UfcatOrangeDark})`};
`;

const GridHeader = styled.th`
  padding: ${props => props.theme.spacing.sm};
  text-align: center;
  border-bottom: 2px solid ${props => props.theme.colors.backgroundDark};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.xs};
  
  background: transparent;
  color: white;
`;

const GridCell = styled.td`
  padding: 2px;
  border: 1px solid ${props => props.theme.colors.backgroundDark};
  vertical-align: top;
  height: 60px;
  background-color: transparent;
`;

const GridClassItem = styled.div`
  font-size: 10px;
  background-color: ${props => {
    switch (props.$period) {
      case 'M': return props.theme.colors.M_PeriodColor;
      case 'T': return props.theme.colors.T_PeriodColor;
      case 'N': return props.theme.colors.N_PeriodColor;
      default: return props.theme.colors.ufcatGreen;
    }
  }};
  color: ${props => props.theme.colors.ufcatBlack};
  padding: 2px;
  border-radius: 4px;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  line-height: 1.1;
  word-break: break-word;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const ModalCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.lg};
  
  /* Prevent scroll propagation */
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.lg};
`;

const ModalRow = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textSecondary};
  
  strong {
    color: ${props => props.theme.colors.textPrimary};
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const ModalCloseButton = styled.button`
  width: 100%;
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
`;

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
      <Container>
        <Title>Semana</Title>
        <EmptyState>
          <EmptyIcon>📅</EmptyIcon>
          <EmptyText>Nenhum horário cadastrado</EmptyText>
          <EmptySubtext>
            Carregue seu horário através da página SIGAA para visualizar suas aulas da semana.
          </EmptySubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <Title style={{ marginBottom: 0 }}>Semana</Title>
        <ViewToggle>
          <ToggleButton 
            $active={viewMode === 'list'} 
            onClick={() => setViewMode('list')}
          >
            Lista
          </ToggleButton>
          <ToggleButton 
            $active={viewMode === 'grid'} 
            onClick={() => setViewMode('grid')}
          >
            Grade
          </ToggleButton>
        </ViewToggle>
      </HeaderContainer>

      {viewMode === 'list' ? (
        <WeekContainer>
          {Object.entries(dayNames).map(([dayKey, dayLabel]) => (
            <DayCard key={dayKey}>
              <DayHeader>{dayLabel}</DayHeader>
              {weekSchedule[dayKey]?.length > 0 ? (
                weekSchedule[dayKey].map((classItem, index) => (
                  <ClassItem key={index}>
                    <ClassTime>
                      {classItem.startTime} - {classItem.endTime}
                    </ClassTime>
                    <ClassName>{classItem.subject || 'Disciplina'}</ClassName>
                    {classItem.location && (
                      <ClassLocation>{classItem.location}</ClassLocation>
                    )}
                  </ClassItem>
                ))
              ) : (
                <EmptyDay>Sem aulas</EmptyDay>
              )}
            </DayCard>
          ))}
        </WeekContainer>
      ) : (
        <GridContainer>
          <GridTable>
            <GridHead>
              <tr>
                {Object.entries(dayNames).map(([key, label]) => (
                  <GridHeader key={key}>{label.split('-')[0].substring(0, 3)}</GridHeader>
                ))}
              </tr>
            </GridHead>
            <tbody>
              {flattenedSlots.map((slot, index) => (
                <tr key={`${slot.label}-${index}`}>
                  {Object.keys(dayNames).map(dayKey => {
                    const classItem = getClassForSlot(dayKey, slot);
                    return (
                      <GridCell key={`${dayKey}-${slot.label}`} $hasContent={!!classItem}>
                        {classItem && (
                          <GridClassItem 
                            $period={slot.label.charAt(0)}
                            onClick={() => setSelectedClass(classItem)}
                          >
                            {classItem.subject}
                          </GridClassItem>
                        )}
                      </GridCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </GridTable>
        </GridContainer>
      )}

      {selectedClass && (
        <ModalOverlay onClick={() => setSelectedClass(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalTitle>Detalhes da Aula</ModalTitle>
            <ModalRow>
              <strong>Disciplina:</strong> {selectedClass.subject}
            </ModalRow>
            {selectedClass.location && (
              <ModalRow>
                <strong>Local:</strong> {selectedClass.location}
              </ModalRow>
            )}
             <ModalRow>
              <strong>Horário:</strong> {selectedClass.startTime} - {selectedClass.endTime}
            </ModalRow>
            {selectedClass.teacher && (
              <ModalRow>
                <strong>Docente:</strong> {selectedClass.teacher}
              </ModalRow>
            )}
             {selectedClass.codigo && (
              <ModalRow>
                <strong>Código:</strong> {selectedClass.codigo}
              </ModalRow>
            )}
             {selectedClass.classCode && (
              <ModalRow>
                <strong>Turma:</strong> {selectedClass.classCode}
              </ModalRow>
            )}
            <ModalCloseButton onClick={() => setSelectedClass(null)}>
              Fechar
            </ModalCloseButton>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default WeeklyScreen;
