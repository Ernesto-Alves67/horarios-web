import { useState, useEffect } from 'react';
import * as Daily from '../components/DailyComponents';
import LocalStorageHelper from '../services/localStorage';


function DailyScreen() {
  const [todayClasses, setTodayClasses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Carrega os horários do localStorage
    const schedules = LocalStorageHelper.getSchedules();
    
    if (schedules) {
      // Filtra as aulas de hoje
      const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Segunda, etc.
      const daysMap = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta'];
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
    <Daily.Container>
      <Daily.Title>Aulas de Hoje</Daily.Title>
      <Daily.DateDisplay>{formatDate(currentDate)}</Daily.DateDisplay>
      {todayClasses.length === 0 ? (
        <Daily.EmptyState>
          <Daily.EmptyIcon>📚</Daily.EmptyIcon>
          <Daily.EmptyText>Nenhuma aula hoje!</Daily.EmptyText>
          <Daily.EmptySubtext>
            Carregue seu horário através da página SIGAA para visualizar suas aulas.
          </Daily.EmptySubtext>
        </Daily.EmptyState>
      ) : (
        todayClasses.map((classItem, index) => (
          <Daily.ClassCard key={index}>
            <Daily.ClassTime>
              {classItem.startTime} - {classItem.endTime}
            </Daily.ClassTime>
            <Daily.ClassName>{classItem.subject || 'Disciplina'}</Daily.ClassName>
            <Daily.ClassDetails>
              {classItem.teacher && <div>Professor(a): {classItem.teacher}</div>}
              {classItem.location && <div>Local: {classItem.location}</div>}
              {classItem.type && <div>Tipo: {classItem.type}</div>}
            </Daily.ClassDetails>
          </Daily.ClassCard>
        ))
      )}
    </Daily.Container>
  );
}

export default DailyScreen;
