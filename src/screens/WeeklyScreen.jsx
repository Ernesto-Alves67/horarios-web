import { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DayCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.md};
`;

const DayHeader = styled.div`
  background-color: ${theme.colors.ufcatGreen};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.lg};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const ClassItem = styled.div`
  background-color: ${theme.colors.backgroundDark};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  margin-bottom: ${theme.spacing.sm};
  border-left: 3px solid ${theme.colors.ufcatGreen};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ClassTime = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 4px;
`;

const ClassName = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ClassLocation = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textSecondary};
`;

const EmptyDay = styled.div`
  text-align: center;
  color: ${theme.colors.textLight};
  font-size: ${theme.fontSize.sm};
  padding: ${theme.spacing.md} 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSize.lg};
  margin-bottom: ${theme.spacing.sm};
`;

const EmptySubtext = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textLight};
`;

function WeeklyScreen() {
  const [weekSchedule, setWeekSchedule] = useState({});

  useEffect(() => {
    // Carrega os horários do localStorage
    const schedules = LocalStorageHelper.getSchedules();
    console.log(schedules)
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
    sabado: 'Sábado',
  };

  const hasAnySchedule = Object.values(weekSchedule).some(day => day.length > 0);

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
      <Title>Semana</Title>
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
    </Container>
  );
}

export default WeeklyScreen;
