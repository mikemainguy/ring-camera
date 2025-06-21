import ring from '@/lib/ring';
import {setTimeout as setTimeoutPromise} from 'timers/promises';
import sqlite3 from 'sqlite3';
import {open } from 'sqlite';

async function pollCameras() {
    const db = await open({
        filename: './ring.db',
        driver: sqlite3.Database
    });
    await db.run('CREATE TABLE IF NOT EXISTS cameras (camera_id integer PRIMARY KEY, name TEXT, current_poll_id INTEGER)');
    await db.run('CREATE TABLE IF NOT EXISTS snapshots (poll_id integer, camera_id integer, image BLOB)');

    console.log('pollCameras');
    const ringApp = ring();
    try {
        const cameras = await ringApp.getCameras();
        console.log('Cameras polled successfully:', cameras.map(cam => cam.name));
        //const footage = await cameras[0].getPeriodicalFootage({startAtMs: (Date.now() - 5260000), endAtMs: Date.now()});
        //console.log(footage);
        while (true) {
            const now = Date.now();
            for (const camera of cameras) {
                try {
                    await db.run('INSERT OR REPLACE INTO cameras (camera_id, name, current_poll_id) VALUES (?, ?, ?)', [camera.id, camera.name, now]);
                    //const dir = `./public/images/${now}/${camera.id}/`;
                    const footage = await camera.getSnapshot();
                    await db.run('INSERT INTO snapshots (poll_id, camera_id, image) VALUES (?, ?, ?)', [now, camera.id, footage]);
                    const count = await db.get('SELECT COUNT(*) as count FROM snapshots WHERE camera_id = ?', [camera.id]);
                    console.log(`Camera ${camera.name} has ${count.count} snapshots in the database.`);
                    //await fsPromises.mkdir(dir, {recursive: true});
                    //await fsPromises.writeFile(dir + 'image.jpg', footage);
                } catch (footageError) {
                    console.error(`Error fetching footage for ${camera.name}:`, footageError);
                }
            }
            await setTimeoutPromise(30000);
        }

    } catch (error) {
        console.error('Error polling cameras:', error);
    }
}

pollCameras();
