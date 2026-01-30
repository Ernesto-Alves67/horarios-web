import { useState, useRef } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';
import ApiService from '../services/api';
import DeviceInfo from '../utils/deviceInfo';

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: #008f4d;
  }
  
  &:disabled {
    background-color: ${theme.colors.textLight};
    cursor: not-allowed;
  }
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

const IframeContainer = styled.div`
  flex: 1;
  background-color: white;
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Message = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${props => props.$error ? '#FFE5E5' : '#E5F9F0'};
  color: ${props => props.$error ? theme.colors.error : theme.colors.success};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
`;

const Instructions = styled.div`
  background-color: ${theme.colors.backgroundDark};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing.md};
  
  h3 {
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSize.lg};
    margin-bottom: ${theme.spacing.md};
  }
  
  ol {
    margin-left: ${theme.spacing.lg};
    
    li {
      color: ${theme.colors.textSecondary};
      margin-bottom: ${theme.spacing.sm};
      font-size: ${theme.fontSize.sm};
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

  const parseScheduleFromHTML = (html) => {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const allSchedules = [];
    
    // Find all <table> elements
    const tables = doc.querySelectorAll('table');
    
    if (tables.length === 0) {
      console.log('Nenhuma tabela encontrada no documento HTML.');
      return [];
    }
    
    // Process each table (similar to Kotlin implementation)
    tables.forEach((table, tableIndex) => {
      const rows = table.querySelectorAll('tbody tr');
      
      // Skip identification tables (index 0 and 2 in original structure)
      if (tableIndex === 0 || tableIndex === 2) {
        return;
      }
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        
        try {
          // Extract data following the SIGAA HTML structure
          // cells[0] = código
          // cells[1] = component curricular + local + docente
          // cells[2] = turma
          // cells[3] = status
          // cells[4] = horário
          
          if (cells.length >= 5) {
            const componenteCurricular = cells[1].querySelector('span.componente')?.textContent?.trim() || '';
            const localRaw = cells[1].querySelector('span.local')?.textContent?.trim() || '';
            const local = localRaw.replace(/^\s*Local\s*:\s*/i, '').trim();
            const docente = cells[1].querySelector('span.docente')?.textContent?.trim() || '';
            
            // Get schedule and clean it (remove parentheses content)
            const horarioBruto = cells[4]?.textContent?.trim() || '';
            const horarioLimpo = horarioBruto.replace(/\s*\(.*?\)/g, '');
            
            // Parse the schedule string to extract days and times
            // Format example: "35M12 (30/12/2024 - 03/05/2025)"
            // Where: 35 = days (3=Wednesday, 5=Friday), M = morning, 12 = time slots
            const scheduleInfo = parseHorario(horarioLimpo);
            
            scheduleInfo.forEach(info => {
              const schedule = {
                codigo: cells[0]?.textContent?.trim() || '',
                subject: componenteCurricular,
                teacher: docente,
                turma: cells[2]?.textContent?.trim() || '',
                status: cells[3]?.textContent?.trim() || '',
                day: info.day,
                startTime: info.startTime,
                endTime: info.endTime,
                location: local,
                horarioCompleto: horarioLimpo
              };
              
              if (schedule.subject) {
                allSchedules.push(schedule);
              }
            });
          }
        } catch (e) {
          console.error('Erro ao processar linha da tabela:', e);
        }
      });
    });
    
    return allSchedules;
  };
  
  // Helper function to parse SIGAA schedule format
  const parseHorario = (horario) => {
    if (!horario) return [];
    
    const schedules = [];
    
    // SIGAA format: "35M12" means days 3 and 5, morning shift, slots 1-2
    // Days: 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday
    // Shifts: M=Morning, T=Afternoon, N=Night
    // Slots: 1-6 (each represents a time period)
    
    const regex = /([2-7]+)([MTN])(\d+)/g;
    let match;
    
    const dayMap = {
      '2': 'segunda',
      '3': 'terca',
      '4': 'quarta',
      '5': 'quinta',
      '6': 'sexta',
      '7': 'sabado'
    };
    
    const timeSlots = {
      'M': { // Morning
        '1': { start: '07:00', end: '07:50' },
        '2': { start: '07:50', end: '08:40' },
        '3': { start: '08:55', end: '09:45' },
        '4': { start: '09:45', end: '10:35' },
        '5': { start: '10:50', end: '11:40' },
        '6': { start: '11:40', end: '12:30' }
      },
      'T': { // Afternoon
        '1': { start: '13:00', end: '13:50' },
        '2': { start: '13:50', end: '14:40' },
        '3': { start: '14:55', end: '15:45' },
        '4': { start: '15:45', end: '16:35' },
        '5': { start: '16:50', end: '17:40' },
        '6': { start: '17:40', end: '18:30' }
      },
      'N': { // Night
        '1': { start: '19:00', end: '19:50' },
        '2': { start: '19:50', end: '20:40' },
        '3': { start: '20:55', end: '21:45' },
        '4': { start: '21:45', end: '22:35' }
      }
    };
    
    while ((match = regex.exec(horario)) !== null) {
      const days = match[1].split('');
      const shift = match[2];
      const slots = match[3].split('');
      
      const firstSlot = slots[0];
      const lastSlot = slots[slots.length - 1];
      
      if (timeSlots[shift] && timeSlots[shift][firstSlot] && timeSlots[shift][lastSlot]) {
        const startTime = timeSlots[shift][firstSlot].start;
        const endTime = timeSlots[shift][lastSlot].end;
        
        days.forEach(dayNum => {
          if (dayMap[dayNum]) {
            schedules.push({
              day: dayMap[dayNum],
              startTime: startTime,
              endTime: endTime
            });
          }
        });
      }
    }
    
    return schedules;
  };

  const extractUserData = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the identification table (id="identificacao")
    const identificacaoTable = doc.querySelector('table#identificacao');
    
    if (!identificacaoTable) {
      console.log('Tabela de identificação não encontrada.');
      return null;
    }
    
    const dataMap = {};
    const rows = identificacaoTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      
      // Process first pair of cells
      if (cells.length >= 2) {
        const key = cells[0].textContent.replace(':', '').trim();
        const strongValue = cells[1].querySelector('strong');
        const value = strongValue ? strongValue.textContent.trim() : cells[1].textContent.trim();
        dataMap[key] = value;
      }
      
      // Process second pair of cells (if exists)
      if (cells.length >= 4) {
        const key2 = cells[2].textContent.replace(':', '').trim();
        const strongValue2 = cells[3].querySelector('strong');
        const value2 = strongValue2 ? strongValue2.textContent.trim() : cells[3].textContent.trim();
        dataMap[key2] = value2;
      }
    });
    
    // Extract user data following the Kotlin structure
    const userData = {
      periodoLetivo: dataMap['Período Letivo'] || dataMap['Periodo Letivo'] || '',
      matricula: dataMap['Matrícula'] || dataMap['Matricula'] || '',
      nome: dataMap['Nome'] || '',
      curso: dataMap['Curso'] || '',
      formacao: dataMap['Formação'] || dataMap['Formacao'] || ''
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
