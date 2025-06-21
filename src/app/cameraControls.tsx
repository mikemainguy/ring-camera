'use client';
import {Checkbox, Text, RangeSlider, Stack} from "@mantine/core";
import {useEffect, useState} from "react";


export default function CameraControls() {
    const [liveView, setLiveView] = useState<boolean>(true);
    const [minMax, setMinMax] = useState({min: 0, max: 0});
    const [sliderValues, setSliderValues] = useState<[number, number]>([0,0]);// Example values, replace with actual min/max if needed
    useEffect(() => {
        const getData = async () => {
            const data = await fetch('/api/cameras')
            const json = await data.json();
            if (json && json.length > 0) {
                const minPollId = Math.min(...json.map((item: { min_poll_id: number }) => item.min_poll_id));
                const maxPollId = Math.max(...json.map((item: { max_poll_id: number }) => item.max_poll_id));
                console.log("Min Poll ID:", minPollId, "Max Poll ID:", maxPollId);
                setMinMax({min: minPollId, max: maxPollId});
                setSliderValues([minPollId, maxPollId]); // Set initial slider values
            } else {
                setMinMax({min: 0, max: 100}); // Default values if no data is available
                setSliderValues([0,100]); // Set initial slider values
            }
        }
        getData();
    }, []) ;

    return <Stack>
            <Checkbox key="liveView" checked={liveView} onChange={(event) => setLiveView(event.currentTarget.checked)} label="Live View"/>
            <RangeSlider
                key="range"
                mt="xl"
                label={null}
                min={minMax.min}
                max={minMax.max}
                value={sliderValues}
                onChange={setSliderValues}
            />
            <Text>Start: {formatDate(sliderValues[0])}</Text>
            <Text>End: {formatDate(sliderValues[1])}</Text>
        </Stack>
}
function formatDate(val: number) {
    const dt = new  Date(val);
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
}