import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
} from "react-native";

import { createInvoice } from '@/services/LightningService';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

type PaymentPopupProps = {
    visible: boolean;
    onClose: () => void;
    total: number; // base total from order
};

export default function PaymentPopup({ visible, onClose, total }: PaymentPopupProps) {
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [tipAmount, setTipAmount] = useState(0);
    const [invoiceResponse, setInvoiceResponse] = useState<string | null>(null);

    const finalTotal = parseFloat((total + tipAmount).toFixed(2));

    const [finalTotalSat, setFinalTotalSat] = useState(0)

    const handleTipSelect = (percentage: number) => {
        setSelectedTip(percentage);
        const calculatedTip = (total * percentage) / 100;
        setTipAmount(parseFloat(calculatedTip.toFixed(2)));
    };

    const handlePress = async () => {
        try {
            const btcPriceInChf = 95500;
            const sats = chfToSatoshis(total + tipAmount, btcPriceInChf);
            setFinalTotalSat(sats)
            const invoice = await createInvoice(finalTotalSat, "Order Payment");
            console.log("Invoice created:", invoice);
            setInvoiceResponse(invoice.payment_request);
        } catch (err) {
            console.error("Failed to create invoice:", err);
        }
    };

    function chfToSatoshis(chfAmount: number, btcPriceInChf: number): number {
        const btcAmount = chfAmount / btcPriceInChf;
        const sats = btcAmount * 100_000_000;
        return Math.floor(sats); // ✅ ensures whole number, no decimals
    }



    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Pay Order</Text>

                    {/* ✅ Show total with tip */}
                    <Text style={styles.totalText}>
                        Total: CHF {finalTotal.toFixed(2)}
                        {selectedTip !== null && (
                            <Text style={{ fontSize: 14, color: "#555" }}>
                                {" "}({selectedTip}% tip included)
                            </Text>
                        )}
                    </Text>

                    <Text style={styles.tipTitle}>Would you like to tip?</Text>
                    <View style={styles.tipButtonsRow}>
                        {[2, 5, 10].map((tip) => (
                            <Pressable
                                key={tip}
                                style={[
                                    styles.tipButton,
                                    selectedTip === tip && styles.tipButtonSelected,
                                ]}
                                onPress={() => handleTipSelect(tip)}
                            >
                                <Text
                                    style={[
                                        styles.tipButtonText,
                                        selectedTip === tip && styles.tipButtonTextSelected,
                                    ]}
                                >
                                    {tip}% Tip
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {invoiceResponse ? (
                        <View style={styles.qrContainer}>
                            <Text style={styles.satsText}>
                                Final Amount: {finalTotalSat} sats
                            </Text>
                            <Text style={styles.title}>Scan to Pay</Text>
                            <QRCodeDisplay value={invoiceResponse} size={250} />
                        </View>
                    ) : null}


                    <Pressable
                        style={styles.invoiceButton}
                        onPress={handlePress}
                    >
                        <Text style={styles.invoiceButtonText}>Create Invoice</Text>
                    </Pressable>

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    tipButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 24,
    },
    tipButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
    },
    tipButtonSelected: {
        backgroundColor: "#7C3AED",
    },
    tipButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    tipButtonTextSelected: {
        color: "#fff",
    },
    invoiceButton: {
        backgroundColor: "#10B981",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
    },
    invoiceButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    closeButton: {
        paddingVertical: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: "#6B7280",
    },
    qrContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    satsText: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
        textAlign: "center",
    },
});
