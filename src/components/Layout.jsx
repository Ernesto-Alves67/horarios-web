import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../utils/theme';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.grayElements};
`;

const TopBar = styled.header`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${theme.colors.ufcatGreen};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
  }
`;

const BottomNav = styled.nav`
  background-color: ${theme.colors.navBackground};
  display: flex;
  justify-content: space-around;
  padding: ${theme.spacing.sm} 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.$active ? theme.colors.ufcatBlack : theme.colors.navTextSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-size: ${theme.fontSize.sm};
  font-weight: ${props => props.$active ? theme.fontWeight.bold : theme.fontWeight.normal};
  min-width: 70px;
  
  &:hover {
    color: ${props => props.$active ? theme.colors.ufcatBlack : theme.colors.navText};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const screens = [
  { 
    route: '/daily', 
    label: 'Hoje',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    )
  },
  { 
    route: '/weekly', 
    label: 'Semana',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
      </svg>
    )
  },
  { 
    route: '/status', 
    label: 'Status',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    )
  },
  { 
    route: '/sigaa', 
    label: 'SIGAA',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
];

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <LayoutContainer>
      <TopBar>
        <Logo>U</Logo>
        <Title>Horários</Title>
      </TopBar>
      
      <MainContent>
        <Outlet />
      </MainContent>
      
      <BottomNav>
        {screens.map((screen) => (
          <NavItem
            key={screen.route}
            $active={location.pathname === screen.route}
            onClick={() => handleNavigation(screen.route)}
          >
            {screen.icon}
            <span>{screen.label}</span>
          </NavItem>
        ))}
      </BottomNav>
    </LayoutContainer>
  );
}

export default Layout;
