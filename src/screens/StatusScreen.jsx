import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';
import DeviceInfo from '../utils/deviceInfo';
import ApiService from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const Card = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.md};
`;

const CardTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.md} 0;
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.ufcatGreen};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.grayElements};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
`;

const InfoValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  text-align: right;
  flex: 1;
  margin-left: ${theme.spacing.md};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  background-color: ${props => props.$success ? theme.colors.success : theme.colors.error};
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: #008f4d;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const WarningText = styled.p`
  color: ${theme.colors.warning};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  margin-top: ${theme.spacing.md};
`;


const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.ufcatGreen};
  color: white;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: #008f4d;
  }
`;

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
          
          // Extract user info
          const userData = extractUserData(htmlContent);
          if (userData) {
            LocalStorageHelper.setUserData(userData);
            
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
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage({ text: 'Erro ao processar o arquivo.', error: true });
      setIsLoading(false);
    }
  };

  const parseScheduleFromHTML = (html) => {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const schedules = [];
    
    // This is a simplified parser - adjust based on actual SIGAA HTML structure
    // Look for table rows with schedule information
    const rows = doc.querySelectorAll('table tr');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const schedule = {
          subject: cells[0]?.textContent?.trim(),
          day: cells[1]?.textContent?.trim()?.toLowerCase(),
          startTime: cells[2]?.textContent?.trim(),
          endTime: cells[3]?.textContent?.trim(),
          location: cells[4]?.textContent?.trim() || '',
          teacher: cells[5]?.textContent?.trim() || '',
          type: cells[6]?.textContent?.trim() || '',
        };
        
        if (schedule.subject && schedule.day) {
          schedules.push(schedule);
        }
      }
    });
    
    return schedules;
  };

  const extractUserData = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract user data from HTML - adjust based on actual structure
    const userData = {
      nome: doc.querySelector('.nome-aluno')?.textContent?.trim() || '',
      matricula: doc.querySelector('.matricula')?.textContent?.trim() || '',
      curso: doc.querySelector('.curso')?.textContent?.trim() || '',
      formacao: doc.querySelector('.formacao')?.textContent?.trim() || '',
      periodoLetivo: doc.querySelector('.periodo')?.textContent?.trim() || '',
    };
    
    return userData;
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
      // Don't show error to user as this is a background operation
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
          <InfoValue>1.0.0-web</InfoValue>
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
          onClick={() => window.open('https://sig.ufcat.edu.br/sigaa/', '_blank')}
        >
          Abrir SIGAA
        </Button>
      </Controls>
    </Container>
  );
}

export default StatusScreen;
