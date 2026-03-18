import styled from 'styled-components';

// ====================== Styles ========================== //

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

export const Card = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border-left: 4px solid ${props => props.$borderColor || 'transparent'};
  margin-bottom: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};
  margin-top: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};
`;

export const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.ufcatGreen};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.grayElements};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

export const InfoValue = styled.span`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  text-align: right;
  flex: 1;
  margin-left: ${props => props.theme.spacing.md};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  background-color: ${props => props.$success ? props.theme.colors.ufcatGreen : props.theme.colors.UfcatRed};
  color: white;
`;

export const Button = styled.label`
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
  text-align: center;
  
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

export const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileLabel = styled.label`
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

export const AddButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background-color: transparent;
  color: ${props => props.theme.colors.ufcatGreen};
  border: 2px solid ${props => props.theme.colors.ufcatGreen};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-align: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.ufcatGreen};
    color: white;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

export const ModalBox = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.md};
`;

export const ModalTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.ufcatGreen};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const FormLabel = styled.label`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.textSecondary};
`;

export const FormInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.grayElements};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textPrimary};
  background-color: ${props => props.theme.colors.background};
  outline: none;
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.ufcatGreen};
  }
`;

export const FormSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.grayElements};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textPrimary};
  background-color: ${props => props.theme.colors.background};
  outline: none;
  cursor: pointer;
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.ufcatGreen};
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};

  & > * {
    flex: 1;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

export const ModalButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: none;

  background-color: ${props => props.$danger
    ? props.theme.colors.UfcatRed
    : props.$secondary
      ? 'transparent'
      : props.theme.colors.ufcatGreen};
  color: ${props => props.$secondary
    ? props.theme.colors.textSecondary
    : 'white'};
  border: ${props => props.$secondary
    ? `1px solid ${props.theme.colors.grayElements}`
    : 'none'};

  &:hover {
    opacity: 0.85;
  }

  &:active {
    transform: scale(0.98);
  }
`;