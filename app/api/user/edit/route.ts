export const runtime = 'edge';
import UserModel from "@/models/users";

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const updateUserSkycoin = await UserModel.findById(body.userId).updateOne({ skycoin: body.skycoin });

        return new Response(JSON.stringify(updateUserSkycoin), { status: 200, headers: { "Content-Type": "application/json" } });



    } catch (error) {
        console.error("Error: ", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}