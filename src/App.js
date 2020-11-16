import React from 'react';
import { RecoilRoot } from 'recoil';

import Layout from './hoc/layout';
import Background from './components/background';
import Footer from './components/footer';
import Routes from './containers/routes';

function App() {
  return (
      <RecoilRoot>
        <Layout>
          <Background/>
          <Routes/>
        </Layout>
        <Footer/>
      </RecoilRoot>
  );
}

export default App;
