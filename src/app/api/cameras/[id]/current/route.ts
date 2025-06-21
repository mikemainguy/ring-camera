import {NextRequest} from 'next/server';
import db from "@/lib/db";

export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> },
) {
    const ringdb = await db();
    const id = (await params).id;
    try {
        const intId = parseInt(id, 10);
        const blob = await ringdb.get("select image from snapshots join cameras on snapshots.camera_id = cameras.camera_id and snapshots.poll_id = cameras.current_poll_id where cameras.camera_id = ?", [intId]);
        if (!blob || !blob.image) {
            return new Response(
                JSON.stringify({error: 'Image not found'}),
                {
                    status: 404,
                    headers: {'Content-Type': 'application/json'}
                }
            );
        }
        return new Response(
            blob.image,
            {
                status: 200,
                headers: {'Content-Type': 'image/jpeg'}
            }
        )
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify(err),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'}
            }
        )
    }
    // e.g. Query a database for user with ID `id`
    /*return new Response(JSON.stringify({ id, name: `User ${id}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });*/
}