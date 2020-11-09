import React from 'react';
import { RecoilRoot } from 'recoil';

import Navigation from './components/nav';
import Layout from './hoc/layout';
import Footer from './components/footer';
import Background from './components/background';
import Routes from './containers/routes';

function App() {
  return (
      <RecoilRoot>
        <Layout>
          <Navigation/>
          <Background/>
          <Routes/>
        </Layout>
        <Footer/>
      </RecoilRoot>
  );
}

export default App;
