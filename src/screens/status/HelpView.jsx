import React, { useEffect } from 'react';
import * as S from './styles';
import styled from 'styled-components';
import packageJson from '../../../package.json';

const HelpContainer = styled.div`
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Estilo para garantir que a instalação fique em uma linha só
const InstructionLine = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.textPrimary};
  white-space: nowrap; /* Impede quebra de linha */
  overflow: hidden;
  text-overflow: ellipsis; /* Se a tela for minúscula, ele coloca ... no fim */

  strong {
    color: ${props => props.theme.colors.ufcatGreen};
    margin-right: 5px;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

const ActionLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: ${props => props.theme.colors.grayElements};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.theme.colors.cardBorder};

  &:hover { 
    background: ${props => props.theme.colors.ufcatGreen}; 
    color: white;
  }
  span { font-size: 20px; }
`;

function HelpView({ onBack, onShowTutorial }) {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <HelpContainer>
      <button 
        onClick={onBack} 
        style={{ 
          background: 'none', border: 'none', color: '#018786', 
          textAlign: 'left', padding: '5px 0 15px 0',
          fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        ← Voltar para Status
      </button>

      <S.Card $compact $borderColor="#FD841A" style={{ marginTop: '0' }}>
        <S.CardTitle>🎥 Tutoriais em Vídeo</S.CardTitle>
        <InfoText>Aprenda a configurar seus horários passo a passo.</InfoText>
        <S.AddButton onClick={onShowTutorial} style={{ marginTop: '15px' }}>
          Assistir Vídeo Tutorial
        </S.AddButton>
      </S.Card>

      <S.Card $compact $borderColor="#018786">
        <S.CardTitle>📱 Como Instalar (PWA)</S.CardTitle>
        <InstructionLine><strong>iOS:</strong> Compartilhar → Adicionar à Tela de Início</InstructionLine>
        <InstructionLine><strong>Android:</strong> Menu → Instalar app / Adicionar à tela</InstructionLine>
        <InstructionLine><strong>Desktop:</strong> Barra de endereços → Ícone Instalar</InstructionLine>
      </S.Card>

      <S.Card $compact $borderColor="#EE2D55">
        <S.CardTitle>🐛 Relatar Bugs ou Sugestões</S.CardTitle>
        <InfoText>Encontrou um problema? O projeto é código aberto!</InfoText>
        
        <ActionLink href="https://github.com/Ernesto-Alves67/horarios-web/issues" target="_blank">
          <span>🐙</span> GitHub: Criar uma Issue
        </ActionLink>
        
        <ActionLink href="https://github.com/Ernesto-Alves67/horarios-web" target="_blank">
          <span>⭐</span> Avaliar projeto no GitHub
        </ActionLink>
      </S.Card>

      <S.Card $compact>
        <S.CardTitle>Sobre o Horários Web</S.CardTitle>
        <InfoText>
          Desenvolvido por <strong>Ernesto Alves</strong> para a comunidade acadêmica da UFCAT.
        </InfoText>
        <InfoText style={{ marginTop: '12px' }}>
          <strong>Versão:</strong> {packageJson.version} <br />
          <strong>Privacidade:</strong> Dados armazenados localmente. <br />
          <strong>Licença:</strong> GPL-3.0
        </InfoText>
      </S.Card>
    </HelpContainer>
  );
}

export default HelpView;