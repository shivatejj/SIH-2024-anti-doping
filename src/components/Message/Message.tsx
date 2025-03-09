import { createContext, useContext, ReactNode } from "react";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";

// Define the Context Type
interface MessageContextType {
  messageApi: MessageInstance;
}

// Create Context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider Component
export const Message = ({ children }: { children: ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

// Custom Hook for Using Messages
export const useMessage = (): MessageInstance => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context.messageApi;
};
