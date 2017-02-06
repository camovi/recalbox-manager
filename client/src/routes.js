import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import Index from './components/Index';
import Audio from './components/Audio';
import Bios from './components/Bios';
import Configuration from './components/Configuration';
import Controllers from './components/Controllers';
import Logs from './components/Logs';
import RecalboxConf from './components/RecalboxConf';
import Systems from './components/Systems';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Index} />
    <Route path="/audio" component={Audio} />
    <Route path="/bios" component={Bios} />
    <Route path="/configuration" component={Configuration} />
    <Route path="/controllers" component={Controllers} />
    <Route path="/recalbox-conf" component={RecalboxConf} />
    <Route path="/logs" component={Logs} />
    <Route path="/systems" component={Systems} />
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
