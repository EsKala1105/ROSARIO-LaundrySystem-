import { Navigate, Route } from 'react-router-dom';
import { PublicRoutes } from '../../models/index';
import Login from '../../pages/public/Login/Login';

import { PublicMainLayout } from '../../_MainLayout/indexLayout';
import RoutesWithNotFound from '../NotFound/RoutesWithNotFound';

import Identify from '../../pages/public/Login/Identify/Indentify';

const Public = () => {
  return (
    <PublicMainLayout>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={PublicRoutes.LOGIN} />} />
        <Route path={PublicRoutes.LOGIN} element={<Login />} />
        <Route path={`/${PublicRoutes.LOGIN}/${PublicRoutes.IDENTIFY}`} element={<Identify />} />
      </RoutesWithNotFound>
    </PublicMainLayout>
  );
};

export default Public;
