import React from 'react';
import { RecoilRoot } from 'recoil';

import Layout from './hoc/layout';
import Footer from './components/footer';
import Background from './components/background';
import Routes from './containers/routes';

function App() {
  return (
      <RecoilRoot>
        <Layout>
          <Background/>
          <Routes/>
        </Layout>
      </RecoilRoot>
  );
}

export default App;
