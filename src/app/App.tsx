import Router from './Router';
import QueryProvider from './queryProvider';
import { SocketProvider } from './socketProvider'; // 방금 만든 파일 import

const App = () => {
  return (
    <QueryProvider>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </QueryProvider>
  );
};

export default App;
