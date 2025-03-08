import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

type StateContextType = {
    socket: WebSocket | undefined;
};

const StateContext = createContext({} as StateContextType);

export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

    useEffect(() => {
        if (socket) return;

        const webSocket = new WebSocket('ws://localhost:2761/socket');

        webSocket.onopen = () => {
            console.log('connected to socket');
            setSocket(webSocket);
        };

        return () => {
            webSocket.close();
        };
    }, [socket]);

    return (
        <StateContext.Provider value={{ socket }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateUpdates = () => {
    const context = useContext(StateContext);

    if (
        context &&
        Object.keys(context).length === 0 &&
        Object.getPrototypeOf(context) === Object.prototype
    ) {
        throw new Error('useExternal must be used within an ExternalProvider');
    }
    return context;
};
