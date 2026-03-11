import React, { useState } from 'react';
import * as StatusComps from './StatusComponents';

const EMPTY_USER = { nome: '', matricula: '', curso: '', periodoLetivo: '', formacao: '' };

function UserModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState(initialData || EMPTY_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const normalized = {
      nome: form.nome.trim(),
      matricula: form.matricula.trim(),
      curso: form.curso.trim(),
      periodoLetivo: form.periodoLetivo.trim(),
      formacao: form.formacao.trim(),
    };
    onSave(normalized);
  };

  return (
    <StatusComps.ModalOverlay onClick={onClose}>
      <StatusComps.ModalBox onClick={e => e.stopPropagation()}>
        <StatusComps.ModalTitle>Editar Dados do Discente</StatusComps.ModalTitle>

        <StatusComps.FormGroup>
          <StatusComps.FormLabel>Nome</StatusComps.FormLabel>
          <StatusComps.FormInput name="nome" value={form.nome} onChange={handleChange} />
        </StatusComps.FormGroup>

        <StatusComps.FormGroup>
          <StatusComps.FormLabel>Matrícula</StatusComps.FormLabel>
          <StatusComps.FormInput name="matricula" value={form.matricula} onChange={handleChange} />
        </StatusComps.FormGroup>

        <StatusComps.FormGroup>
          <StatusComps.FormLabel>Curso</StatusComps.FormLabel>
          <StatusComps.FormInput name="curso" value={form.curso} onChange={handleChange} />
        </StatusComps.FormGroup>

        <StatusComps.ModalActions>
          <StatusComps.ModalButton $secondary onClick={onClose}>Cancelar</StatusComps.ModalButton>
          <StatusComps.ModalButton onClick={handleSave}>Salvar</StatusComps.ModalButton>
        </StatusComps.ModalActions>
      </StatusComps.ModalBox>
    </StatusComps.ModalOverlay>
  );
}

export default UserModal;