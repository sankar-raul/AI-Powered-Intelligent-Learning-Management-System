import { get, deleteRequest } from "../apiMethod";

const ROUTE = "documents";

export interface IDocument {
    document_id: string;
    original_filename: string;
    stored_filename: string;
    file_type: string;
    file_size: number;
    file_hash: string;
    status: string;
    uploaded_by: string;
    created_at: string;
    updated_at: string;
}

export const getAllDocuments = async (): Promise<IDocument[]> => {
    try {
        const response = await get(ROUTE);
        return response.data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch documents';
        throw new Error(message);
    }
};

export const getDocumentById = async (documentId: string): Promise<IDocument> => {
    try {
        const response = await get(`${ROUTE}/${documentId}`);
        return response.data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch document';
        throw new Error(message);
    }
};

export const deleteDocument = async (documentId: string): Promise<{ message: string; data: { document_id: string } }> => {
    try {
        const response = await deleteRequest(`${ROUTE}/${documentId}`);
        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete document';
        throw new Error(message);
    }
};
