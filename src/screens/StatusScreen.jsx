import { useState, useEffect, useRef } from 'react';
import * as StatusComps from '../components/StatusComponents';
import LocalStorageHelper from '../services/localStorage';
import DeviceInfo from '../utils/deviceInfo';
import ApiService from '../services/api';
import { parseScheduleFromHTML, extractUserData, readFileWithEncoding, detectCharsetFromHtml } from '../utils/sigaaParser';



/*==================================================================================================== */

/* Definition of the StatusScreen component */
function StatusScreen() {
  const [hasSchedule, setHasSchedule] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);

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
      // 1️⃣ Primeiro tenta UTF-8
      let htmlContent = await readFileWithEncoding(file, 'utf-8');

      // 2️⃣ Detecta charset real
      const detectedCharset = detectCharsetFromHtml(htmlContent);

      // 3️⃣ Se for diferente, relê
      if (detectedCharset && detectedCharset !== 'utf-8') {
        htmlContent = await readFileWithEncoding(file, detectedCharset);
      }

      // 4️⃣ Processa HTML normalmente
      const schedules = parseScheduleFromHTML(htmlContent);

      if (schedules && schedules.length > 0) {
        LocalStorageHelper.setSchedules(schedules);
        LocalStorageHelper.setFileLoaded(true);
        setHasSchedule(true);

        const userData = extractUserData(htmlContent);
        if (userData) {
          LocalStorageHelper.setUserData(userData);
          setUserData(userData);
          await registerDevice(userData);
        }

        setMessage({
          text: `Horário carregado com sucesso! ${schedules.length} aula(s) encontrada(s).`,
          error: false
        });
      } else {
        setMessage({
          text: 'Nenhuma aula encontrada no arquivo. Verifique se o arquivo está correto.',
          error: true
        });
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setMessage({ text: 'Erro ao processar o arquivo.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const registerDevice = async (userData) => {
    try {
      const registerBody = DeviceInfo.createRegisterBody(userData);

      if (LocalStorageHelper.isFirstAccess()) {
        await ApiService.registerUser(registerBody);
        LocalStorageHelper.setFirstAccess(false);
      } else {
        await ApiService.updateUser(registerBody);
      }
    } catch (error) {
      console.error('Failed to register/update device:', error);
    }
  };

  useEffect(() => {
    // Verifica se há horários carregados
    const schedules = LocalStorageHelper.getSchedules();
    setHasSchedule(schedules && schedules.length > 0);

    // Carrega dados do usuário
    const user = LocalStorageHelper.getUserData();
    setUserData(user);

    // Obtém informações do dispositivo
    const info = DeviceInfo.getDeviceInfo();
    setDeviceInfo(info);
  }, []);


  return (
    <StatusComps.Container>
      <StatusComps.Title>Status</StatusComps.Title>

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
      {userData && (
        <StatusComps.Card>
          <StatusComps.CardTitle>Dados do Usuário</StatusComps.CardTitle>
          {userData.nome && (
            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Nome:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.nome}</StatusComps.InfoValue>
            </StatusComps.InfoRow>
          )}
          {userData.matricula && (
            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Matrícula:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.matricula}</StatusComps.InfoValue>
            </StatusComps.InfoRow>
          )}
          {userData.curso && (
            <StatusComps.InfoRow>
              <StatusComps.InfoLabel>Curso:</StatusComps.InfoLabel>
              <StatusComps.InfoValue>{userData.curso}</StatusComps.InfoValue>
            </StatusComps.InfoRow>
          )}
        </StatusComps.Card>
      )}


      <StatusComps.Card>
        <StatusComps.CardTitle>Sobre</StatusComps.CardTitle>
        <StatusComps.InfoRow>
          <StatusComps.InfoLabel>Versão:</StatusComps.InfoLabel>
          <StatusComps.InfoValue>1.0.0</StatusComps.InfoValue>
        </StatusComps.InfoRow>
        <StatusComps.InfoRow>
          <StatusComps.InfoLabel>Plataforma:</StatusComps.InfoLabel>
          <StatusComps.InfoValue>Progressive Web App</StatusComps.InfoValue>
        </StatusComps.InfoRow>
      </StatusComps.Card>
      <StatusComps.Controls>
        <StatusComps.FileInput
          ref={fileInputRef}
          type="file"
          accept=".html"
          onChange={handleFileUpload}
          id="file-upload"
        />
        <StatusComps.FileLabel htmlFor="file-upload">
          {isLoading ? 'Carregando...' : 'Carregar Arquivo HTML'}
        </StatusComps.FileLabel>
        <StatusComps.Button
          onClick={() => window.open('https://sigaa.sistemas.ufcat.edu.br/sigaa/mobile/touch/public/principal.jsf', '_blank')}
        >
          Entrar no SIGAA
        </StatusComps.Button>
      </StatusComps.Controls>
    </StatusComps.Container>
  );
}

export default StatusScreen;
