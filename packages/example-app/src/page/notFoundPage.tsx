import React from 'react';
import { useRouteError } from 'react-router-dom';
import { PageLayout } from '../layout/pageLayout';

export function NotFoundPage(
  props: {
  }
) 
{
  return (
    <PageLayout title="not found">
      <div>page not found.</div>
    </PageLayout>
  );
}