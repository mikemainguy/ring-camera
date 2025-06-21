'use client';
import {Flex} from "@mantine/core";
import CameraCard from "@/app/cameraCard";
import CameraControls from "@/app/cameraControls";
import {useEffect, useState} from "react";

export default function Home() {
    const [cameras, setCameras] = useState([])
    //const cameras = await ringdb.all('select camera_id from cameras order by camera_id;');
    useEffect(() => {
        async function fetchCameras() {
            const cameras = await fetch('/api/cameras');
            const json = await cameras.json();
            setCameras(json);
        }
        fetchCameras();
    })
    return (
        <>
            <CameraControls/>
            <Flex direction="row" gap="md" justify="center" wrap="wrap" align="center">
                <CameraList cameras={cameras}/>
            </Flex>
        </>

    );
}
function CameraList({cameras}: { cameras: {camera_id: number, name: string}[] }) {
    return (
        cameras.map((camera, index) => (
            <CameraCard key={index} camera={camera} scale={.75} />
        ))
    );
}
