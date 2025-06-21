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
        const snapshots = await ringdb.all("select poll_id from snapshots  where camera_id = ? order by poll_id desc", [intId]);
        if (!snapshots || snapshots.length == 0) {
            return new Response(
                JSON.stringify({error: 'snapshots not found'}),
                {
                    status: 404,
                    headers: {'Content-Type': 'application/json'}
                }
            );
        }
        return new Response(
            JSON.stringify(snapshots.map((snapshot) => snapshot.poll_id)),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'}
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