import React, { Suspense } from 'react';
import LoadingCustom from 'components/parts/loading/Loading';
import { AppRouter } from 'components/router/AppRouter';

class App extends React.Component {
  render() {
    return (
      <Suspense fallback={<LoadingCustom />}>
        <AppRouter />
      </Suspense>
    );
  }  

};


export default App;
