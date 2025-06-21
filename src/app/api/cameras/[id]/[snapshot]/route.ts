import {NextRequest} from "next/server";
import db from "@/lib/db";

export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ id: string, snapshot: string }> },
) {
    const p = await params;
    const id = parseInt(p?.id, 10);
    const snapshot = parseInt(p?.snapshot, 10);
    if (isNaN(id) || isNaN(snapshot)) {
        return new Response(
            JSON.stringify({error: 'Invalid camera or snapshot ID'}),
            {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            }
        );
    }
    const ringdb = await db();
    const data = await ringdb.get("select image from snapshots where camera_id = ? and poll_id = ?", [id, snapshot]);
    if (!data || !data.image) {
        return new Response(
            JSON.stringify({error: 'Image not found'}),
            {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            }
        );
    }
    return new Response(
        data.image,
        {
            status: 200,
            headers: {'Content-Type': 'image/jpeg', 'Max-Age': '86400', 'Cache-Control': 'public, max-age=86400'}
        }
    );
}