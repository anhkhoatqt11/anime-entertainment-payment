import UserModel from "@/models/users";
import connectMongoDB from "@/app/lib/mongodb";

export async function GET(request: Request) {
    connectMongoDB();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const phoneNumber = searchParams?.get("phone");
    const phoneNumberAddPlus = "+" + phoneNumber; 
    const phoneNumberRemoveSpace = phoneNumberAddPlus.replace(/\s+/, "") ;

    if (!phoneNumber) {
        // Handle invalid phone number
        return new Response("Invalid phone number", { status: 400 });
    }

    try {
        const user = await UserModel.findOne({ phone: phoneNumberRemoveSpace }).select("username _id");
        
        if (!user) {
            // Handle user not found
            return new Response(`User not found for ${phoneNumberRemoveSpace}`, { status: 404 });
        }

        // Return username and _id
        return new Response(JSON.stringify({ username: user.username, id: user._id }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle errors
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
