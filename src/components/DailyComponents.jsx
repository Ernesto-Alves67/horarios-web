import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

export const DateDisplay = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

export const ClassCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
  border-left: 4px solid ${props => props.theme.colors.ufcatGreen};
`;

export const ClassTime = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const ClassName = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`;

export const ClassDetails = styled.div`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.sm};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const EmptyText = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const EmptySubtext = styled.p`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textLight};
`;
