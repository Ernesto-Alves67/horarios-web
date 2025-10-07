import { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const DateDisplay = styled.div`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const ClassCard = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.md};
  border-left: 4px solid ${theme.colors.ufcatGreen};
`;

const ClassTime = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: ${theme.spacing.sm};
`;

const ClassName = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ClassDetails = styled.div`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.sm};
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

function DailyScreen() {
  const [todayClasses, setTodayClasses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Carrega os horários do localStorage
    const schedules = LocalStorageHelper.getSchedules();
    
    if (schedules) {
      // Filtra as aulas de hoje
      const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Segunda, etc.
      const daysMap = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      const todayName = daysMap[dayOfWeek];
      
      const classes = schedules.filter(schedule => 
        schedule.day?.toLowerCase() === todayName
      );
      
      // Ordena por horário
      classes.sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
      
      setTodayClasses(classes);
    }
  }, [currentDate]);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <Container>
      <Title>Aulas de Hoje</Title>
      <DateDisplay>{formatDate(currentDate)}</DateDisplay>
      
      {todayClasses.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>Nenhuma aula hoje!</EmptyText>
          <EmptySubtext>
            Carregue seu horário através da página SIGAA para visualizar suas aulas.
          </EmptySubtext>
        </EmptyState>
      ) : (
        todayClasses.map((classItem, index) => (
          <ClassCard key={index}>
            <ClassTime>
              {classItem.startTime} - {classItem.endTime}
            </ClassTime>
            <ClassName>{classItem.subject || 'Disciplina'}</ClassName>
            <ClassDetails>
              {classItem.teacher && <div>Professor(a): {classItem.teacher}</div>}
              {classItem.location && <div>Local: {classItem.location}</div>}
              {classItem.type && <div>Tipo: {classItem.type}</div>}
            </ClassDetails>
          </ClassCard>
        ))
      )}
    </Container>
  );
}

export default DailyScreen;
