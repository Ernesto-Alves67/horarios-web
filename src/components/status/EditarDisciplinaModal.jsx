import React, { useState, useEffect } from 'react';
import * as StatusComps from './StatusComponents';
import { TIME_SLOTS } from '../../utils/sigaaParser';
import { DIAS, EMPTY_FORM, getSlotsFromTimes } from '../../utils/horarioUtils';

function EditarDisciplinaModal({ mode, initialIndex, schedules, onClose, onSave, onDelete, setMessage }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && selectedIndex !== '') {
      const target = schedules[Number(selectedIndex)];
      if (target) {
        const slots = getSlotsFromTimes(target.startTime, target.endTime);
        setForm({
          subject: target.subject || '',
          teacher: target.teacher || '',
          day: target.day || 'segunda',
          period: slots.period,
          startSlot: slots.startSlot,
          endSlot: slots.endSlot,
          location: target.location || '',
        });
      }
    }
  }, [mode, selectedIndex, schedules]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'period') {
      setForm(prev => ({ ...prev, period: value, startSlot: '', endSlot: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!form.subject.trim() || !form.startSlot || !form.endSlot) {
      setMessage({ text: 'Preencha todos os campos obrigatórios.', error: true });
      return;
    }

    const periodSlots = TIME_SLOTS[form.period];
    const newEntry = {
      subject: form.subject.trim(),
      teacher: form.teacher.trim(),
      day: form.day,
      startTime: periodSlots[form.startSlot].start,
      endTime: periodSlots[form.endSlot].end,
      location: form.location.trim(),
      status: 'ATIVA'
    };

    onSave(newEntry, mode === 'edit' ? Number(selectedIndex) : null);
    setMessage({ text: 'Disciplina salva com sucesso!', error: false });
    onClose();
  };

  const periodSlots = TIME_SLOTS[form.period] || {};
  const slotOptions = Object.keys(periodSlots).sort((a, b) => Number(a) - Number(b));

  return (
    <StatusComps.ModalOverlay onClick={onClose}>
      <StatusComps.ModalBox onClick={e => e.stopPropagation()}>
        <StatusComps.ModalTitle>
          {mode === 'edit' ? 'Editar Disciplina' : 'Adicionar Disciplina'}
        </StatusComps.ModalTitle>

        {mode === 'edit' && (
          <StatusComps.FormGroup>
            <StatusComps.FormLabel>Selecione a disciplina</StatusComps.FormLabel>
            <StatusComps.FormSelect value={selectedIndex} onChange={e => setSelectedIndex(e.target.value)}>
              {schedules.map((sch, i) => (
                <option key={i} value={String(i)}>{sch.subject}</option>
              ))}
            </StatusComps.FormSelect>
          </StatusComps.FormGroup>
        )}

        <StatusComps.FormGroup>
          <StatusComps.FormLabel>Nome da Disciplina *</StatusComps.FormLabel>
          <StatusComps.FormInput name="subject" value={form.subject} onChange={handleFormChange} />
        </StatusComps.FormGroup>
        
        {/* Adicione os outros campos de formulário (teacher, day, period, etc) aqui, de forma similar ao código original */}

            <StatusComps.FormGroup>
              <StatusComps.FormLabel>Professor(a)</StatusComps.FormLabel>
              <StatusComps.FormInput
                name="teacher"
                value={form.teacher}
                onChange={handleFormChange}
                placeholder="Ex: João da Silva"
              />
            </StatusComps.FormGroup>

            <StatusComps.FormGroup>
              <StatusComps.FormLabel>Dia da Semana *</StatusComps.FormLabel>
              <StatusComps.FormSelect name="day" value={form.day} onChange={handleFormChange}>
                {DIAS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </StatusComps.FormSelect>
            </StatusComps.FormGroup>

            <StatusComps.FormGroup>
              <StatusComps.FormLabel>Período *</StatusComps.FormLabel>
              <StatusComps.FormSelect name="period" value={form.period} onChange={handleFormChange}>
                <option value="M">M - Manhã</option>
                <option value="T">T - Tarde</option>
                <option value="N">N - Noite</option>
              </StatusComps.FormSelect>
            </StatusComps.FormGroup>

            <StatusComps.FormRow>
              <StatusComps.FormGroup>
                <StatusComps.FormLabel>Início *</StatusComps.FormLabel>
                <StatusComps.FormSelect name="startSlot" value={form.startSlot} onChange={handleFormChange}>
                  <option value="">Selecione</option>
                  {slotOptions.map(slotKey => (
                    <option key={`start-${form.period}-${slotKey}`} value={slotKey}>
                      {`${form.period}${slotKey} - ${periodSlots[slotKey].start}-${periodSlots[slotKey].end}`}
                    </option>
                  ))}
                </StatusComps.FormSelect>
              </StatusComps.FormGroup>
              
            <StatusComps.FormGroup>
                <StatusComps.FormLabel>Fim *</StatusComps.FormLabel>
                <StatusComps.FormSelect name="endSlot" value={form.endSlot} onChange={handleFormChange}>
                  <option value="">Selecione</option>
                  {slotOptions.map(slotKey => (
                    <option key={`end-${form.period}-${slotKey}`} value={slotKey}>
                      {`${form.period}${slotKey} - ${periodSlots[slotKey].start}-${periodSlots[slotKey].end}`}
                    </option>
                  ))}
                </StatusComps.FormSelect>
              </StatusComps.FormGroup>
            </StatusComps.FormRow>

            <StatusComps.FormGroup>
              <StatusComps.FormLabel>Local</StatusComps.FormLabel>
              <StatusComps.FormInput
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder="Ex: Sala 101 Bloco J"
              />
            </StatusComps.FormGroup>


        <StatusComps.ModalActions>
          <StatusComps.ModalButton $secondary onClick={onClose}>Cancelar</StatusComps.ModalButton>
          {mode === 'edit' && (
            <StatusComps.ModalButton $danger onClick={() => { setShowDeleteConfirm(true)}}>
              Excluir
            </StatusComps.ModalButton>
          )}

          {/* --- SUB-MODAL: CONFIRMAÇÃO DE EXCLUSÃO --- */}
                {showDeleteConfirm && (
                  <StatusComps.ModalOverlay style={{ zIndex: 2000 }} onClick={() => setShowDeleteConfirm(false)}>
                    <StatusComps.ModalBox onClick={e => e.stopPropagation()}>
                      <StatusComps.ModalTitle>Confirmar Exclusão</StatusComps.ModalTitle>
                      <StatusComps.FormGroup>
                        <StatusComps.FormLabel>
                          Tem certeza que deseja excluir a disciplina "<strong>{form.subject}</strong>"?
                        </StatusComps.FormLabel>
                      </StatusComps.FormGroup>
                      <StatusComps.ModalActions>
                        <StatusComps.ModalButton $secondary onClick={() => setShowDeleteConfirm(false)}>
                          Não, voltar
                        </StatusComps.ModalButton>
                        <StatusComps.ModalButton $danger onClick={() => {
                          onDelete(Number(selectedIndex));
                          onClose(); // Fecha tudo após excluir
                        }}>
                          Sim, excluir
                        </StatusComps.ModalButton>
                      </StatusComps.ModalActions>
                    </StatusComps.ModalBox>
                  </StatusComps.ModalOverlay>
                )}

          <StatusComps.ModalButton onClick={handleSave}>Salvar</StatusComps.ModalButton>
        </StatusComps.ModalActions>
      </StatusComps.ModalBox>
    </StatusComps.ModalOverlay>
  );
}

export default EditarDisciplinaModal;