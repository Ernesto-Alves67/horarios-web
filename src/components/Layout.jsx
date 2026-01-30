import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// ====================== Styles ========================== //

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Altura dinâmica para navegadores mobile modernos */
  height: 100dvh; 
  background-color: ${props => props.theme.colors.grayElements};
`;

const TopBar = styled.header`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  height: 60px; /* Altura fixa menor */
  position: relative;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  // background-color: ${props => props.theme.colors.ufcatGreen};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 4px;
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.xl};
    img {
    width: 52px; /* Ocupa todo o container reduzido */
    height: auto;
  };
`;

const BackgroundForLogo = styled.div`
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 4px;
  background-color: ${props => props.theme.colors.backgroundToggleTheme};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  margin-top: 0.8rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: 1.20rem;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundToggleTheme};
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.background};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
  
  &:hover {
    opacity: 0.6;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm};
    /* Adiciona padding extra em baixo para o conteúdo não ficar escondido atrás do menu fixo */
    padding-bottom: 90px;
  }
`;

const BottomNav = styled.nav`
  background-color: ${props => props.theme.colors.ufcatGreen};
  display: flex;
  justify-content: space-around;
  padding: ${props => props.theme.spacing.sm} 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    /* Suporte para áreas seguras (iPhone X+) */
    padding-bottom: max(${props => props.theme.spacing.sm}, env(safe-area-inset-bottom));
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 16px;
  border-radius: 16px;
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  transition: background-color 0.3s ease;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.navText : props.theme.colors.navTextSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.$active ? props.theme.fontWeight.bold : props.theme.fontWeight.normal};
  min-width: 70px;
  
  &:hover {
    color: ${props => props.theme.colors.navText};
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
  // { 
  //   route: '/sigaa', 
  //   label: 'SIGAA',
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  //     </svg>
  //   )
  // },
];


// ====================== Layout Component ========================== //
/* Definition of the main Layout component */
function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <LayoutContainer>
      <TopBar>
        <Logo>
          <img src="/ic_logo_ufcat.svg" alt="Logo da UFCAT" />
        </Logo>
        <Title>Horários</Title>
        <ThemeToggle onClick={toggleTheme} title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}>
          {isDarkMode ? '☀️' : '🌙'}
        </ThemeToggle>
      </TopBar>
      
      <MainContent>
        <Outlet />
      </MainContent>
      
      <BottomNav>
        {screens.map((screen) => {
          const isActive = location.pathname === screen.route;
          return (
            <NavItem
              key={screen.route}
              $active={isActive}
              onClick={() => handleNavigation(screen.route)}
            >
              <IconWrapper $active={isActive}>
                {screen.icon}
              </IconWrapper>
              <span>{screen.label}</span>
            </NavItem>
          );
        })}
      </BottomNav>
    </LayoutContainer>
  );
}

export default Layout;
