
import db from "@/lib/db";

export async function GET() {
    const ringdb= await db();
    const snapshots = await ringdb.all("select camera_id, min(poll_id) as min_poll_id, max(poll_id) as max_poll_id from snapshots group by camera_id");
    // e.g. Query a database for user with ID `id`

    return new Response(JSON.stringify(snapshots), {
        status: 200,
        headers: {'Content-Type': 'application/json', 'max-age': '61', 'Cache-Control': 'public}, max-age=61'}
    });
}