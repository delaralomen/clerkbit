import { API_TOKEN, ALBY_ENDPOINT } from "@env";

export const createInvoice = async (
    amount: number,
    description: string
) => {
    if (!API_TOKEN || !ALBY_ENDPOINT) {
        throw new Error("Missing API_TOKEN or ALBY_ENDPOINT in .env file");
    }

    const requestBody = { amount, description };

    try {
        const response = await fetch(ALBY_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Invoice created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error;
    }
};
