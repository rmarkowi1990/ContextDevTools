import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

type Message = {
    provider: string;
    state: any;
};

type StateContextType = {
    socket: WebSocket | undefined;
    updatedProvider: string | undefined;
    current: any;
    previous: any;
};

const StateContext = createContext({} as StateContextType);

export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<StateContextType['socket']>(undefined);
    const [current, setCurrent] = useState<StateContextType['current']>({});
    const [previous, setPrevious] = useState<StateContextType['previous']>({});
    const [updatedProvider, setUpdatedProvider] =
        useState<StateContextType['updatedProvider']>(undefined);

    useEffect(() => {
        if (socket) return;

        const webSocket = new WebSocket('ws://localhost:2761/socket');

        webSocket.onopen = () => {
            setSocket(webSocket);
        };

        webSocket.onmessage = (event) => {
            const data: Message = JSON.parse(event.data);
            const { provider, state } = data;

            setPrevious(current);
            setCurrent((current: StateContextType['current']) => {
                return { ...current, [provider]: state };
            });
            setUpdatedProvider(provider);
        };

        return () => {
            webSocket.close();
        };
    }, [socket]);

    return (
        <StateContext.Provider
            value={{ socket, current, previous, updatedProvider }}
        >
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
