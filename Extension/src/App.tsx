import './App.css';
import { useStateUpdates } from './Providers/StateProvider';
function App() {
    const { current } = useStateUpdates();

    return (
        <main className="h-[500px] w-[400px]">{JSON.stringify(current)}</main>
    );
}

export default App;
