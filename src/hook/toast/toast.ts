import { useContext } from "react";
import { ToastContext } from "../../component/toast/toast";

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default useToast;