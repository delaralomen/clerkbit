export const createInvoice = async (
    amount: number,
    description: string
) => {
    //TODO: this is a temporary situation, the keys must be stored in an ENV file on the backend, and QR codes generated on server side, to then be received and displayed by client device
    const API_TOKEN = "TMP key replace with existing one, dont push"
    const ALBY_ENDPOINT = "TMP key replace with existing one, dont push"
    console.log(123)
    console.log(API_TOKEN)
    if (!API_TOKEN || !ALBY_ENDPOINT) {
        throw new Error("Missing API_TOKEN or ALBY_ENDPOINT in .env file");
    }
    console.log(123)
    console.log(amount)

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
