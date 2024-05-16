export const runtime = 'edge';
import PaymentHistory from "@/models/paymenthistory";

export async function POST (req: Request) {
    const body = await req.json();

    const data = await PaymentHistory.create({
        userId: body.userId,
        orderDate: body.orderDate,
        paymentMethod: body.paymentMethod,
        status: body.status,
        price: body.price,
        packageId: body.packageId,
    });
    
    if (data) {
        return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
    }
}