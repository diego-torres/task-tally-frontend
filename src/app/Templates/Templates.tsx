import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import TemplatesListPage from './TemplatesListPage';
import TemplateCreatePage from './TemplateCreatePage';
import TemplateEditPage from './TemplateEditPage';
import TemplateViewPage from './TemplateViewPage';

const Templates: React.FC = () => (
  <Routes>
    <Route path="/" element={<TemplatesListPage />} />
    <Route path="/new" element={<TemplateCreatePage />} />
    <Route path=":id" element={<TemplateViewPage />} />
    <Route path=":id/edit" element={<TemplateEditPage />} />
  </Routes>
);

export { Templates };
