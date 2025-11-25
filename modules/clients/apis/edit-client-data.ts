import { apiClient, baseURL } from "@/config/axios-config";


type EditClientDataBody = {
    branch_ids?: string[];
    broker_id?: string;
    chat_mail?: string;
}

export const editClientData = async (id: string, body: EditClientDataBody) => {
    try {
        const url = `${baseURL}/company-users/clients/${id}`;
        const response = await apiClient.post(url, body);
        return response.data;
    } catch (error) {
        console.error('Error editing client data:', error);
        throw error;
    }
}