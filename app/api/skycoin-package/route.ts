import SkyCoinPackages from "@/models/skycoinpackages";

export async function GET(request: Request) {
    try {
        const packages = await SkyCoinPackages.find().select("packageName quantity price");
        return new Response(JSON.stringify(packages), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}