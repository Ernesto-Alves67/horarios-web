import { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';
import LocalStorageHelper from '../services/localStorage';
import DeviceInfo from '../utils/deviceInfo';

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

function StatusScreen() {
  const [hasSchedule, setHasSchedule] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

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

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      LocalStorageHelper.clearAll();
      window.location.reload();
    }
  };

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
        <InfoRow>
          <InfoLabel>Token de Acesso:</InfoLabel>
          <InfoValue>
            <StatusBadge $success={!!LocalStorageHelper.getAccessToken()}>
              {LocalStorageHelper.getAccessToken() ? 'Ativo' : 'Inativo'}
            </StatusBadge>
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Primeiro Acesso:</InfoLabel>
          <InfoValue>
            {LocalStorageHelper.isFirstAccess() ? 'Sim' : 'Não'}
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

      {deviceInfo && (
        <Card>
          <CardTitle>Informações do Dispositivo</CardTitle>
          <InfoRow>
            <InfoLabel>Sistema:</InfoLabel>
            <InfoValue>{deviceInfo.osVersion}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Navegador:</InfoLabel>
            <InfoValue>{deviceInfo.browserName} {deviceInfo.browserVersion}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Dispositivo:</InfoLabel>
            <InfoValue>{deviceInfo.deviceName}</InfoValue>
          </InfoRow>
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

      <Button onClick={handleClearData}>
        Limpar Todos os Dados
      </Button>
      <WarningText>
        ⚠️ Esta ação irá remover todos os dados salvos localmente
      </WarningText>
    </Container>
  );
}

export default StatusScreen;
