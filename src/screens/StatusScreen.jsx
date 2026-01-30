import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LocalStorageHelper from '../services/localStorage';
import DeviceInfo from '../utils/deviceInfo';
import ApiService from '../services/api';
import { parseScheduleFromHTML, extractUserData } from '../utils/sigaaParser';

// ====================== Styles ========================== //

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.ufcatGreen};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.grayElements};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  text-align: right;
  flex: 1;
  margin-left: ${props => props.theme.spacing.md};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  background-color: ${props => props.$success ? props.theme.colors.ufcatGreen : props.theme.colors.UfcatRed};
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.ufcatGreenDark};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

// const WarningText = styled.p`
//   color: ${props => props.theme.colors.warning};
//   font-size: ${props => props.theme.fontSize.sm};
//   text-align: center;
//   margin-top: ${props => props.theme.spacing.md};
// `;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-align: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.ufcatGreenDark};
  }
`;

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
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const htmlContent = e.target.result;
        
        // Parse HTML to extract schedule information
        const schedules = parseScheduleFromHTML(htmlContent);
        if (schedules && schedules.length > 0) {
          // Save schedules to localStorage
          LocalStorageHelper.setSchedules(schedules);
          LocalStorageHelper.setFileLoaded(true);
          setHasSchedule(true); // Update local state immediately
          
          // Extract user info
          const userData = extractUserData(htmlContent);
          if (userData) {
            LocalStorageHelper.setUserData(userData);
            setUserData(userData); // Update local state immediately
            
            // Register or update device info
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
        
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        setMessage({ text: 'Erro ao ler o arquivo.', error: true });
        setIsLoading(false);
      };
      
      // O SIGAA utiliza encoding windows-1252 (ANSI)
      reader.readAsText(file, 'windows-1252');
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage({ text: 'Erro ao processar o arquivo.', error: true });
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
    <Container>
      <Title>Status</Title>
      
      <Card>
        <CardTitle>Status do Sistema</CardTitle>
        <InfoRow>
          <InfoLabel>Horários Carregados:</InfoLabel>
          <InfoValue>
            <StatusBadge $success={hasSchedule}>
              {hasSchedule ? 'Sim' : 'Não'}
            </StatusBadge>
          </InfoValue>
        </InfoRow>

      </Card>

      {userData && (
        <Card>
          <CardTitle>Dados do Usuário</CardTitle>
          {userData.nome && (
            <InfoRow>
              <InfoLabel>Nome:</InfoLabel>
              <InfoValue>{userData.nome}</InfoValue>
            </InfoRow>
          )}
          {userData.matricula && (
            <InfoRow>
              <InfoLabel>Matrícula:</InfoLabel>
              <InfoValue>{userData.matricula}</InfoValue>
            </InfoRow>
          )}
          {userData.curso && (
            <InfoRow>
              <InfoLabel>Curso:</InfoLabel>
              <InfoValue>{userData.curso}</InfoValue>
            </InfoRow>
          )}
        </Card>
      )}


      <Card>
        <CardTitle>Sobre</CardTitle>
        <InfoRow>
          <InfoLabel>Versão:</InfoLabel>
          <InfoValue>1.0.0</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Plataforma:</InfoLabel>
          <InfoValue>Progressive Web App</InfoValue>
        </InfoRow>
      </Card>
      <Controls>
        <FileInput
          ref={fileInputRef}
          type="file"
          accept=".html"
          onChange={handleFileUpload}
          id="file-upload"
        />
        <FileLabel htmlFor="file-upload">
          {isLoading ? 'Carregando...' : 'Carregar Arquivo HTML'}
        </FileLabel>
        <Button 
          onClick={() => window.open('https://sigaa.sistemas.ufcat.edu.br/sigaa/mobile/touch/public/principal.jsf', '_blank')}
        >
          Abrir SIGAA
        </Button>
      </Controls>
    </Container>
  );
}

export default StatusScreen;
