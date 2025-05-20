"use client";

import { useEffect } from "react";
import * as d3 from "d3";

export const Hydration = () => {
    useEffect(() => {
        const svg = d3.select(".LineChart");

        svg
            .on("mousemove", function(e, d) {
                console.log(e, d);
                svg.select(".line").attr("stroke", "steelblue");
            })
            .on("mouseleave", function() {
                svg.select(".line").attr("stroke", "black");
            });
    }, []);

    return <></>;
}