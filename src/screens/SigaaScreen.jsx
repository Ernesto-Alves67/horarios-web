import { useState, useRef } from 'react';
import styled from 'styled-components';
import LocalStorageHelper from '../services/localStorage';
import ApiService from '../services/api';
import DeviceInfo from '../utils/deviceInfo';
import { parseScheduleFromHTML, extractUserData } from '../utils/sigaaParser';

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: #008f4d;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: #008f4d;
  }
`;

const IframeContainer = styled.div`
  flex: 1;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Message = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.$error ? '#FFE5E5' : '#E5F9F0'};
  color: ${props => props.$error ? props.theme.colors.error : props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
`;

const Instructions = styled.div`
  background-color: ${props => props.theme.colors.backgroundDark};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.md};
  
  h3 {
    color: ${props => props.theme.colors.textPrimary};
    font-size: ${props => props.theme.fontSize.lg};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  ol {
    margin-left: ${props => props.theme.spacing.lg};
    
    li {
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: ${props => props.theme.spacing.sm};
      font-size: ${props => props.theme.fontSize.sm};
    }
  }
`;

function SigaaScreen() {
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
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
      
      {message && (
        <Message $error={message.error}>
          {message.text}
        </Message>
      )}
      
      <IframeContainer>
        <Iframe
          ref={iframeRef}
          src="https://sigaa.sistemas.ufcat.edu.br/sigaa/mobile/touch/public/principal.jsf"
          title="SIGAA"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
        />
      </IframeContainer>
      
    </Container>
  );
}

export default SigaaScreen;
