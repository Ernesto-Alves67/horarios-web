import React, { useState, useRef } from 'react';
import * as Status_S from './styles';
import { useDisciplinas } from '../../hooks/useDisciplinas';
import EditarDisciplinaModal from '../../components/status/EditarDisciplinaModal';
import UserModal from '../../components/status/UserModal';
import ApiService from '../../services/api';
import DeviceInfo from '../../utils/deviceInfo';
import LocalStorageHelper from '../../services/localStorage';
import { processarArquivoHtml, readFileWithEncoding, detectCharsetFromHtml } from '../../utils/sigaaParser';

function StatusScreen() {
  const { 
    schedules, setSchedules, userData, hasSchedule, setHasSchedule, 
    saveSubject, deleteSubject, saveUserData 
  } = useDisciplinas();
  
  const [modalState, setModalState] = useState({ type: null, mode: 'add', index: null });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
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

      const parsedSchedules = processarArquivoHtml(htmlContent, saveUserData);


      if (parsedSchedules && parsedSchedules.length > 0) {
        LocalStorageHelper.setSchedules(parsedSchedules);
        LocalStorageHelper.setFileLoaded(true);
        setSchedules(parsedSchedules);
        setHasSchedule(true);

        const totalUnicos = new Set(parsedSchedules.map(s => s.codigo)).size;
        setMessage({ text: `Horário carregado com sucesso! ${totalUnicos} aula(s).`, error: false });
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

  const handleClearData = () => {
    LocalStorageHelper.setSchedules([]);
    LocalStorageHelper.setFileLoaded(false);
    saveUserData(null);
    setSchedules([]);
    setHasSchedule(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage({ text: 'Dados e horários foram limpos.', error: false });
    setShowClearConfirm(false);
  };

  return (
    <Status_S.Container>
      {message && (
        <div style={{ color: message.error ? 'red' : 'green', marginBottom: 10 }}>
          {message.text}
        </div>
      )}

      {/* <Status_S.Card>
        <Status_S.CardTitle>Status do Sistema</Status_S.CardTitle>
        <Status_S.InfoRow>
          <Status_S.InfoLabel>Horários Carregados:</Status_S.InfoLabel>
          <Status_S.InfoValue>
            <Status_S.StatusBadge $success={hasSchedule}>
              {hasSchedule ? 'Sim' : 'Não'}
            </Status_S.StatusBadge>
          </Status_S.InfoValue>
        </Status_S.InfoRow>
      </Status_S.Card> */}

      <Status_S.Card>
        <Status_S.CardTitle>Dados do Discente</Status_S.CardTitle>
        {userData ? (
          <>
            <Status_S.InfoRow>
              <Status_S.InfoLabel>Nome:</Status_S.InfoLabel>
              <Status_S.InfoValue>{userData.nome}</Status_S.InfoValue>
            </Status_S.InfoRow>
            
            <Status_S.InfoRow>
              <Status_S.InfoLabel>Matrícula:</Status_S.InfoLabel>
              <Status_S.InfoValue>{userData.matricula}</Status_S.InfoValue>
            </Status_S.InfoRow>

            <Status_S.InfoRow>
              <Status_S.InfoLabel>Curso:</Status_S.InfoLabel>
              <Status_S.InfoValue>{userData.curso}</Status_S.InfoValue>
            </Status_S.InfoRow>

          </>
        ) : (
          <Status_S.InfoRow>
            <Status_S.InfoLabel>Dados:</Status_S.InfoLabel>
            <Status_S.InfoValue>Não preenchidos</Status_S.InfoValue>
          </Status_S.InfoRow>
        )}
        <Status_S.AddButton onClick={() => setModalState({ type: 'user' })}>
          Editar Dados
        </Status_S.AddButton>
      </Status_S.Card>

      <Status_S.Controls>
        <Status_S.FileInput
          ref={fileInputRef} type="file" accept=".html"
          onChange={handleFileUpload} id="file-upload"
        />
        <Status_S.FileLabel htmlFor="file-upload">
          {isLoading ? 'Carregando...' : 'Carregar Arquivo HTML'}
        </Status_S.FileLabel>
        
        <Status_S.AddButton onClick={() => setModalState({ type: 'subject', mode: 'add' })}>
          Adicionar Disciplina Manualmente
        </Status_S.AddButton>
        
        {hasSchedule && (
          <Status_S.AddButton onClick={() => setModalState({ type: 'subject', mode: 'edit', index: '0' })}>
            Editar Disciplina
          </Status_S.AddButton>
        )}
        
        <Status_S.Button onClick={() => window.open('https://sigaa.sistemas.ufcat.edu.br/sigaa/mobile/touch/public/principal.jsf', '_blank')}>
          Entrar no SIGAA
        </Status_S.Button>

        <Status_S.Button onClick={() => setShowClearConfirm(true)} disabled={!hasSchedule && !userData}>
          Limpar dados
        </Status_S.Button>
      </Status_S.Controls>

      {showClearConfirm && (
        <Status_S.ModalOverlay onClick={() => setShowClearConfirm(false)}>
          <Status_S.ModalBox onClick={e => e.stopPropagation()}>
            <Status_S.ModalTitle>Confirmar limpeza</Status_S.ModalTitle>
            <Status_S.FormGroup>
              <Status_S.FormLabel>
                Essa ação ira apagar os dados do usuário e todas as disciplinas carregadas?
              </Status_S.FormLabel>
            </Status_S.FormGroup>
            <Status_S.ModalActions>
              <Status_S.ModalButton $secondary onClick={() => setShowClearConfirm(false)}>
                Cancelar
              </Status_S.ModalButton>
              <Status_S.ModalButton $danger onClick={handleClearData}>
                Sim, limpar tudo
              </Status_S.ModalButton>
            </Status_S.ModalActions>
          </Status_S.ModalBox>
        </Status_S.ModalOverlay>
      )}

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
    </Status_S.Container>
  );
}

export default StatusScreen;