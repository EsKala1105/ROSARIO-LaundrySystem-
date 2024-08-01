import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { PrivateRoutes } from '../models/Routes-M/Routes';
import store from '../redux/store';
import { AuthGuard } from './Guard/index';

import { Routes } from 'react-router-dom';

import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import LoaderSpiner from '../components/LoaderSpinner/LoaderSpiner';

//const Login = lazy(() => import("../pages/public/Login/Login"));
const Private = lazy(() => import('./Private/Private'));
const Public = lazy(() => import('./Public/Public'));

function AppRoute() {
  return (
    <Suspense
      fallback={
        <div className="loading-general">
          <LoaderSpiner />
        </div>
      }
    >
      <Notifications position="bottom-left" style={{ width: 'auto' }} />
      <Provider store={store}>
        <ModalsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
          <DatesProvider
            settings={{
              locale: 'es',
              firstDayOfWeek: 0,
              weekendDays: [0],
              timeFormat: 'hh:mm A',
            }}
          >
            <BrowserRouter>
              <Routes>
                {/* RUTAS PUBLICAS */}
                <Route path="/*" element={<Public />} />

                {/* RUTAS PRIVADAS */}
                <Route element={<AuthGuard isPrivate={true} />}>
                  <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private />} />
                </Route>

                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </BrowserRouter>
          </DatesProvider>
        </ModalsProvider>
      </Provider>
    </Suspense>
  );
}

export default AppRoute;
