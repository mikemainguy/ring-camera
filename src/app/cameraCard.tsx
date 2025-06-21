import {Card} from "@mantine/core";
import CameraImage from "@/app/cameraImage";

export default function CameraCard({camera, scale}: {camera: {camera_id: number, name: string}, scale?: number}) {
    const rescale = scale || 1;
    return (
        <Card key={camera.camera_id} w={640*rescale} h={(360*rescale)+64}>
            <CameraImage index={camera.camera_id} name={camera.name} scale={rescale}/>
        </Card>
    )
}