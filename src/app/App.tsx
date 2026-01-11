import { OverlayProvider } from 'overlay-kit';

import QueryProvider from './queryProvider';
import Router from './Router';
import { SocketProvider } from './socketProvider';

const App = () => {
  return (
    <QueryProvider>
      <SocketProvider>
        <OverlayProvider>
          <Router />
        </OverlayProvider>
      </SocketProvider>
    </QueryProvider>
  );
};

export default App;
