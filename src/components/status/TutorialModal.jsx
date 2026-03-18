import React, { useState } from 'react';
import * as StatusComps from '../../screens/status/styles';
import DeviceInfo from '../../utils/deviceInfo';
import styled from 'styled-components';

const VideoWrapper = styled.div`
  width: 100%;
  background: #111;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: ${props => (props.$isMobileVideo ? '9 / 16' : '16 / 9')};
  max-height: ${props => (props.$isMobileVideo ? '55vh' : '65vh')}; 
  border: 1px solid rgba(255,255,255,0.1);

  video {
    width: 100%;
    height: 100%;
    object-fit: contain; 
  }
`;

// Estilo para o aviso de "Em Breve"
const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  text-align: center;
  padding: 20px;
  gap: 10px;
  span { font-size: 40px; }
  p { font-size: 14px; font-weight: 500; }
`;

// Botão de alternar estilo "Pílula"
const ToggleContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.grayElements};
  padding: 4px;
  border-radius: 50px;
  align-self: center;
  margin-bottom: 10px;
  border: 1px solid ${props => props.theme.colors.cardBorder};
`;

const ToggleOption = styled.button`
  border: none;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  background: ${props => props.$active ? props.theme.colors.ufcatGreen : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.textSecondary};

  &:hover {
    color: ${props => props.$active ? 'white' : props.theme.colors.ufcatGreen};
  }
`;

function TutorialModal({ onClose }) {
  const info = DeviceInfo.getDeviceInfo();
  const isMobileInitial = info.deviceName.includes('Mobile');
  const [videoType, setVideoType] = useState(isMobileInitial ? 'mobile' : 'desktop');

  // SIMULAÇÃO: Se você ainda não tem o vídeo mobile, mude para 'false' quando tiver.
  const hasMobileVideo = false; 

  return (
    <StatusComps.ModalOverlay onClick={onClose} style={{ paddingTop: '70px', paddingBottom: '95px' }}>
      <StatusComps.ModalBox 
        onClick={e => e.stopPropagation()} 
        style={{ 
          width: '95%',
          maxWidth: videoType === 'mobile' ? '340px' : '1100px', 
          maxHeight: '100%', 
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          backgroundColor: '#1E1E1E',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <StatusComps.ModalTitle style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#fff', textAlign: 'center' }}>
          Tutorial de Uso
        </StatusComps.ModalTitle>
        
        {/* Seletor estilo Pílula */}
        <ToggleContainer>
          <ToggleOption 
            $active={videoType === 'mobile'} 
            onClick={() => setVideoType('mobile')}
          >
            📱 Celular
          </ToggleOption>
          <ToggleOption 
            $active={videoType === 'desktop'} 
            onClick={() => setVideoType('desktop')}
          >
            💻 Computador
          </ToggleOption>
        </ToggleContainer>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <VideoWrapper $isMobileVideo={videoType === 'mobile'}>
              {/* Lógica para mostrar o vídeo ou o aviso de em breve */}
              {(videoType === 'mobile' && !hasMobileVideo) ? (
                <ComingSoon>
                  <span>🎬</span>
                  <p>Tutorial para celular<br/>disponível em breve!</p>
                </ComingSoon>
              ) : (
                <video 
                    key={videoType}
                    controls 
                    playsInline 
                    autoPlay
                    poster="/tutorial/poster.jpg"
                >
                    <source src={`/tutorial/${videoType}.mp4`} type="video/mp4" />
                </video>
              )}
            </VideoWrapper>
        </div>

        <StatusComps.ModalActions style={{ marginTop: '10px' }}>
          <StatusComps.ModalButton onClick={onClose} style={{ fontWeight: 'bold' }}>
            Fechar
          </StatusComps.ModalButton>
        </StatusComps.ModalActions>
      </StatusComps.ModalBox>
    </StatusComps.ModalOverlay>
  );
}

export default TutorialModal;