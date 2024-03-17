import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { NotFoundPage } from './page/notFoundPage';
import { Example1Page } from './page/example1Page';

function App() {
  return (
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(
      <Route 
        path='/' 
        errorElement={<NotFoundPage />}
        element={<Outlet />}
      >
        <Route path="/example1" element={<Example1Page />} />

        
      </Route>
    ))} />
  );
}

export default App;
