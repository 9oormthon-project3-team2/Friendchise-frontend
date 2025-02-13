import { Provider } from '@/components/ui/provider';
import React from 'react';

function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
