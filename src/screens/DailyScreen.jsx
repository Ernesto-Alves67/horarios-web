import { useState, useEffect } from 'react';
import styled from 'styled-components';
import LocalStorageHelper from '../services/localStorage';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const DateDisplay = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ClassCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
  border-left: 4px solid ${props => props.theme.colors.ufcatGreen};
`;

const ClassTime = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ClassName = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

const ClassDetails = styled.div`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.sm};
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
