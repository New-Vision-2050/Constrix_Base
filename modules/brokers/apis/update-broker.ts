
import { apiClient, baseURL } from "@/config/axios-config";


type EditBrokerDataBody = {
    branch_ids?: string[];
    chat_mail?: string;
}

export const editBrokerData = async (id: string, body: EditBrokerDataBody) => {
    try {
        const url = `${baseURL}/company-users/brokers/${id}`;
        const response = await apiClient.post(url, body);
        return response.data;
    } catch (error) {
        console.error('Error editing client data:', error);
        throw error;
    }
}