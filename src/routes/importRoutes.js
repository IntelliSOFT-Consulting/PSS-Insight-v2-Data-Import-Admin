import Template from '../Pages/Template';
import Upload from '../Pages/Upload';
import Export from '../Pages/Export';
import GHO from '../Pages/GHO';

const routes = [
  {
    path: '/',
    element: Template,
  },
  {
    path: '/upload',
    element: Upload,
  },
  {
    path: '/export',
    element: Export,
  },
  {
    path: '/gho',
    element: GHO,
  },
];

export default routes;
