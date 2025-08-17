import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
} from '@patternfly/react-core';
import logo from '../../logo.png';
import { IAppRoute, routes } from '@app/routes';
import {
  BarsIcon,
  FolderOpenIcon,
  HomeIcon,
  ListIcon,
  QuestionCircleIcon
} from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Task Tally Logo" style={{ height: 40, marginRight: 12 }} />
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--pf-t--global--text--color--regular)' }}>Task Tally</span>
          </div>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink to={route.path.endsWith('/*') ? route.path.replace('/*', '') : route.path} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {route.label === 'Home' && <HomeIcon style={{ marginRight: 4 }} />}
        {route.label === 'Templates' && <ListIcon style={{ marginRight: 4 }} />}
        {route.label === 'Proposals' && <FolderOpenIcon style={{ marginRight: 4 }} />}
        {!['Home', 'Templates', 'Proposals'].includes(route.label || '') && <QuestionCircleIcon style={{ marginRight: 4 }} />}
        {route.label}
      </NavLink>
    </NavItem>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">{routes.map((route, idx) => route.label && renderNavItem(route, idx))}</NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );
  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
    >
      {children}
    </Page>
  );
};

export { AppLayout };
