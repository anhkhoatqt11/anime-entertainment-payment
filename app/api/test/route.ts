
export async function GET(request: Request) {
    try {
        return new Response("test", { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}