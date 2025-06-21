'use client';
import {Image, LoadingOverlay, Text} from '@mantine/core'
import {useEffect, useState} from "react";

export default function CameraImage({index, name, scale}: { index: number, name: string, scale: number }) {
    const [lastUpdate, setLastUpdate] = useState<Date|null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [live, setLive] = useState<boolean>(true);
    useEffect(() => {
        if (live) {
            setLastUpdate(new Date());
            const getData = async() => {
                const data = await fetch(`/api/cameras/${index}`);
                const json = await data.json()
                if (json && json.length>0) {
                    setImages(json.slice(0,30).reverse());
                }
            }
            getData();
            const slowTimer = setInterval(() => {
                setLastUpdate(new Date());
                getData();
            }, 30000);
            return () => {
                clearInterval(slowTimer);
            }
        }
    }, [live])
    useEffect(() => {
        if (live && images && images.length > 0) {
            const fastTimer = setInterval(() => {
                console.log(images[imageIndex], imageIndex);
                setImageIndex((prevIndex) => (prevIndex +1) % images.length)
            }, 100); // Update every 5 seconds
            return () => {clearInterval(fastTimer)};
        }
    }, [images, live]);
    const rescale = scale || 1;
    return (
        <>
            <LoadingOverlay visible={!lastUpdate} />
            <Text bg="#ffffff">{name}</Text>
            <Image w={640*rescale} h={360*rescale} src={`/api/cameras/${index}/${images[imageIndex]}`} />
            <Text>{new Date(images[imageIndex]).toLocaleTimeString()}</Text>
        </>
    )
}