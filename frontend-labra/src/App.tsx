
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Todo } from "./components/todo";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  );
}

export default App;
