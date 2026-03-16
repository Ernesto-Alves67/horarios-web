import React from 'react';
import * as Daily from '../../screens/daily/styles'; // Estilos específicos do Card

function ClassCard({ classItem }) {
  // Se não houver item, não renderiza nada
  if (!classItem) return null;

  return (
    <Daily.ClassCard> 
      <Daily.ClassTime>
        {classItem.startTime} - {classItem.endTime}
      </Daily.ClassTime>
      
      <Daily.ClassName>{classItem.subject || 'Disciplina'}</Daily.ClassName>
      
      <Daily.ClassDetails>
        {classItem.teacher && (
          <div><strong>Professor(a):</strong> {classItem.teacher}</div>
        )}
        {classItem.location && (
          <div><strong>Local:</strong> {classItem.location}</div>
        )}
      </Daily.ClassDetails>
    </Daily.ClassCard>
  );
}

export default ClassCard;