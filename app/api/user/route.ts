import UserModel from "@/models/users";

export async function GET(request: Request) {
    try {
        // Fetch all users
        const users = await UserModel.find().select("username _id");

        // Return the list of users
        return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        // Handle errors
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}