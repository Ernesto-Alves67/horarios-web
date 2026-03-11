
// import React from 'react';
import * as S from '../../screens/weekly/styles';
import { DAY_NAMES } from '../../utils/horarioUtils';

function WeeklyGrid( visibleSlots, getClassForSlot, setSelectedClass }) {
  return (
    <S.GridContainer>
      <S.GridTable>
        <S.GridHead>
          <tr>
            {Object.entries(DAY_NAMES).map(([key, label]) => (
              <S.GridHeader key={key}>
                {label.split('-')[0].substring(0, 3)}
              </S.GridHeader>
            ))}
          </tr>
        </S.GridHead>
        <tbody>
          {visibleSlots.map((slot, index) => (
            <tr key={`${slot.label}-${index}`}>
              {Object.keys(DAY_NAMES).map((dayKey) => {
                const classItem = getClassForSlot(dayKey, slot);
                
                return (
                  <S.GridCell 
                    key={`${dayKey}-${slot.label}`} 
                    $hasContent={!!classItem}
                  >
                    {classItem && (
                      <S.GridClassItem 
                        $period={slot.label.charAt(0)}
                        onClick={() => setSelectedClass(classItem)}
                      >
                        {classItem.subject}
                      </S.GridClassItem>
                    )}
                  </S.GridCell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </S.GridTable>
    </S.GridContainer>
  );
}

function ClassDetailModal({ classItem, onClose }) {
  // Se não houver aula selecionada, não renderiza nada
  if (!classItem) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalCard onClick={e => e.stopPropagation()}>
        <S.ModalTitle>Detalhes da Aula</S.ModalTitle>
        
        <S.ModalRow>
          <strong>Disciplina:</strong> {classItem.subject}
        </S.ModalRow>

        {classItem.location && (
          <S.ModalRow>
            <strong>Local:</strong> {classItem.location}
          </S.ModalRow>
        )}

        <S.ModalRow>
          <strong>Horário:</strong> {classItem.startTime} - {classItem.endTime}
        </S.ModalRow>

        {classItem.teacher && (
          <S.ModalRow>
            <strong>Docente:</strong> {classItem.teacher}
          </S.ModalRow>
        )}

        {classItem.codigo && (
          <S.ModalRow>
            <strong>Código:</strong> {classItem.codigo}
          </S.ModalRow>
        )}

        {classItem.classCode && (
          <S.ModalRow>
            <strong>Turma:</strong> {classItem.classCode}
          </S.ModalRow>
        )}

        <S.ModalCloseButton onClick={onClose}>
          Fechar
        </S.ModalCloseButton>
      </S.ModalCard>
    </S.ModalOverlay>
  );
}



export default {WeeklyGrid, ClassDetailModal};