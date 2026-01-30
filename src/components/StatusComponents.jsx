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
  margin-bottom: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
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

export const Button = styled.button`
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