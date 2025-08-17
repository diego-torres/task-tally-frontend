import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from '@app/Home/Home';
import { Templates } from '@app/Templates/Templates';
import { Proposals } from '@app/Proposals/Proposals';
import { NotFound } from '@app/NotFound/NotFound';
import { GitSSHKeys } from '@app/GitSSHKeys/GitSSHKeys';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
}

export type AppRouteConfig = IAppRoute;

const routes: AppRouteConfig[] = [
  {
    element: <Home />,
    exact: true,
    label: 'Home',
    path: '/',
    title: 'Task Tally | Home',
  },
  {
    element: <Templates />,
    label: 'Templates',
    path: '/templates/*',
    title: 'Task Tally | Templates',
  },
  {
    element: <Proposals />,
    exact: true,
    label: 'Proposals',
    path: '/proposals',
    title: 'Task Tally | Proposals',
  },
  {
    element: <GitSSHKeys />,
    exact: true,
    label: 'Git SSH keys',
    path: '/git-ssh-keys',
    title: 'Task Tally | Git SSH keys',
  },
];

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {routes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
