import PortOne from "@portone/browser-sdk/v2";

interface PaymentRequest {
  orderName: string;
  totalAmount: number;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
}

export async function requestPayment({
  orderName,
  totalAmount,
  orderId,
  customerName,
  customerEmail,
}: PaymentRequest) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
    paymentId: orderId,
    orderName,
    totalAmount,
    currency: "CURRENCY_KRW",
    payMethod: "EASY_PAY",
    customer: {
      fullName: customerName,
      email: customerEmail,
    },
    redirectUrl: `${window.location.origin}/payment/complete`,
  });

  if (response?.code) {
    throw new Error(response.message || "결제 실패");
  }

  return response;
}
