import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.xxl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.backgroundDark};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 4px;
  gap: 4px;
`;

export const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.$active ? props.theme.colors.ufcatGreen : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.$active ? 'white' : props.theme.colors.textPrimary};
  }
`;

export const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DayCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

export const DayHeader = styled.div`
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.UfcatRed}, ${props.theme.colors.UfcatOrange}, ${props.theme.colors.UfcatOrangeDark})`};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

export const ClassItem = styled.div`
  background-color: ${props => props.theme.colors.backgroundDark};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-left: 3px solid ${props => props.theme.colors.ufcatGreen};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ClassTime = styled.div`
  font-size: ${props => props.theme.fontSize.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 10px;
  }
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.medium};
  margin-bottom: 4px;
`;

export const ClassName = styled.div`
  font-size: ${props => props.theme.fontSize.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 10px;
  }
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 4px;
`;

export const ClassLocation = styled.div`
  font-size: ${props => props.theme.fontSize.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 10px;
  }
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyDay = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.fontSize.sm};
  padding: ${props => props.theme.spacing.md} 0;
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

// Grid View Components
export const GridContainer = styled.div`
  overflow-x: hidden;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xxs};
`;

export const GridTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const GridHead = styled.thead`
  background: ${props => `linear-gradient(90deg, ${props.theme.colors.UfcatRed}, ${props.theme.colors.UfcatOrange}, ${props.theme.colors.UfcatOrangeDark})`};
`;

export const GridHeader = styled.th`
  padding: ${props => props.theme.spacing.sm};
  text-align: center;
  border-bottom: 2px solid ${props => props.theme.colors.backgroundDark};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.md};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 10px;
  }
  background: transparent;
  color: white;
`;

export const GridCell = styled.td`
  padding: 2px;
  border: 1px solid ${props => props.theme.colors.backgroundDark};
  vertical-align: top;
  height: 60px;
  background-color: transparent;
`;

export const GridClassItem = styled.div`
  font-size: ${props => props.theme.fontSize.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 10px;
  }

  background-color: ${props => {
    switch (props.$period) {
      case 'M': return props.theme.colors.M_PeriodColor;
      case 'T': return props.theme.colors.T_PeriodColor;
      case 'N': return props.theme.colors.N_PeriodColor;
      default: return props.theme.colors.ufcatGreen;
    }
  }};
  color: ${props => props.theme.colors.ufcatBlack};
  padding: 2px;
  border-radius: 4px;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  line-height: 1.1;
  word-break: break-word;
  font-weight: 500;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

export const ModalCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.lg};
  
  /* Prevent scroll propagation */
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalTitle = styled.h3`
  margin-top: 0;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.lg};
`;

export const ModalRow = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.textSecondary};
  
  strong {
    color: ${props => props.theme.colors.textPrimary};
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

export const ModalCloseButton = styled.button`
  width: 100%;
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.ufcatGreen};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
`;

