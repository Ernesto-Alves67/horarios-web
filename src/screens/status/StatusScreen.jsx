import React, { useState, useRef } from 'react';
import * as StatusComps from '../../components/status/StatusComponents';
import { useDisciplinas } from '../../hooks/useDisciplinas';
import EditarDisciplinaModal from '../../components/status/EditarDisciplinaModal';
import UserModal from '../../components/status/UserModal';
import ApiService from '../../services/api';
import DeviceInfo from '../../utils/deviceInfo';
import LocalStorageHelper from '../../services/localStorage';
import { parseScheduleFromHTML, extractUserData, readFileWithEncoding, detectCharsetFromHtml } from '../../utils/sigaaParser';

function StatusScreen() {
  const { 
    schedules, setSchedules, userData, hasSchedule, setHasSchedule, 
    saveSubject, deleteSubject, saveUserData 
  } = useDisciplinas();
  
  const [modalState, setModalState] = useState({ type: null, mode: 'add', index: null });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const closeModal = () => setModalState({ type: null, mode: 'add', index: null });

  const registerDevice = async (user) => {
    try {
      const registerBody = DeviceInfo.createRegisterBody(user);
      if (LocalStorageHelper.isFirstAccess()) {
        await ApiService.registerUser(registerBody);
        LocalStorageHelper.setFirstAccess(false);
      } else {
        await ApiService.updateUser(registerBody);
      }
    } catch (error) {
      console.error('Failed to sync user data:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/html') {
      setMessage({ text: 'Por favor, selecione um arquivo HTML válido.', error: true });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      let htmlContent = await readFileWithEncoding(file, 'utf-8');
      const detectedCharset = detectCharsetFromHtml(htmlContent);

      if (detectedCharset && detectedCharset !== 'utf-8') {
        htmlContent = await readFileWithEncoding(file, detectedCharset);
      }

      const parsedSchedules = parseScheduleFromHTML(htmlContent);

      if (parsedSchedules && parsedSchedules.length > 0) {
        LocalStorageHelper.setSchedules(parsedSchedules);
        LocalStorageHelper.setFileLoaded(true);
        setSchedules(parsedSchedules);
        setHasSchedule(true);

        const extractedUser = extractUserData(htmlContent);
        if (extractedUser) {
          saveUserData(extractedUser);
          await registerDevice(extractedUser);
        }

        setMessage({ text: `Horário carregado com sucesso! ${parsedSchedules.length} aula(s).`, error: false });
      } else {
        setMessage({ text: 'Nenhuma aula encontrada no arquivo.', error: true });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage({ text: 'Erro ao processar o arquivo.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StatusComps.Container>
      {message && (
        <div style={{ color: message.error ? 'red' : 'green', marginBottom: 10 }}>
          {message.text}
        </div>
      )}

      <StatusComps.Card>
        <StatusComps.CardTitle>Status do Sistema</StatusComps.CardTitle>
        <StatusComps.InfoRow>
          <StatusComps.InfoLabel>Horários Carregados:</StatusComps.InfoLabel>
          <StatusComps.InfoValue>
            <StatusComps.StatusBadge $success={hasSchedule}>
              {hasSchedule ? 'Sim' : 'Não'}
            </StatusComps.StatusBadge>
          </StatusComps.InfoValue>
        </StatusComps.InfoRow>
      </StatusComps.Card>

      <StatusComps.Card>
        <StatusComps.CardTitle>Dados do Aluno</StatusComps.CardTitle>
        {userData ? (
          <>
            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Nome:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.nome}</StatusComps.InfoValue>
            </StatusComps.InfoRow>
            
            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Matrícula:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.matricula}</StatusComps.InfoValue>
            </StatusComps.InfoRow>

            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Curso:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.curso}</StatusComps.InfoValue>
            </StatusComps.InfoRow>

          </>
        ) : (
          <StatusComps.InfoRow>
            <StatusComps.InfoLabel>Dados:</StatusComps.InfoLabel>
            <StatusComps.InfoValue>Não preenchidos</StatusComps.InfoValue>
          </StatusComps.InfoRow>
        )}
        <StatusComps.AddButton onClick={() => setModalState({ type: 'user' })}>
          Editar Dados do Aluno
        </StatusComps.AddButton>
      </StatusComps.Card>

      <StatusComps.Controls>
        <StatusComps.FileInput
          ref={fileInputRef} type="file" accept=".html"
          onChange={handleFileUpload} id="file-upload"
        />
        <StatusComps.FileLabel htmlFor="file-upload">
          {isLoading ? 'Carregando...' : 'Carregar Arquivo HTML'}
        </StatusComps.FileLabel>
        
        <StatusComps.AddButton onClick={() => setModalState({ type: 'subject', mode: 'add' })}>
          Adicionar Disciplina Manualmente
        </StatusComps.AddButton>
        
        {hasSchedule && (
          <StatusComps.AddButton onClick={() => setModalState({ type: 'subject', mode: 'edit', index: '0' })}>
            Editar Disciplina
          </StatusComps.AddButton>
        )}
        
        <StatusComps.Button onClick={() => window.open('https://sigaa.sistemas.ufcat.edu.br/sigaa/mobile/touch/public/principal.jsf', '_blank')}>
          Entrar no SIGAA
        </StatusComps.Button>
      </StatusComps.Controls>

      {modalState.type === 'subject' && (
        <EditarDisciplinaModal 
          mode={modalState.mode}
          initialIndex={modalState.index}
          schedules={schedules}
          onClose={closeModal}
          onSave={saveSubject}
          onDelete={deleteSubject}
          setMessage={setMessage}
        />
      )}

      {modalState.type === 'user' && (
        <UserModal 
          initialData={userData} 
          onClose={closeModal} 
          onSave={async (data) => {
            saveUserData(data);
            // await registerDevice(data);
            setMessage({ text: 'Dados atualizados!', error: false });
            closeModal();
          }} 
        />
      )}
    </StatusComps.Container>
  );
}

export default StatusScreen;