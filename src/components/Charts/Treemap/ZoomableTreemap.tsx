import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { transformDataForD3ReactTree } from "../../../utils/transformToGraph";
import d3TreeDummyDataFlare from "../../../data/d3TreeDummyDataFlare-2";
import { svg } from "d3";

function ZoomableTreemap(props) {
  let data = props.data || d3TreeDummyDataFlare;
  const width = "100%";
  const height = "100%";

  let format = d3.format(",d");
  const svgRef = useRef(null);

  useEffect(() => {
    const partition = (data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);
      return d3.partition().size([height, ((root.height + 1) * width) / 3])(
        root
      );
    };

    const root = partition(data);
    let focus = root;
    let color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );

    svgRef.current = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

    const svg = svgRef.current;

    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y0},${d.x0})`);

    const rect = cell
      .append("rect")
      .attr("width", (d) => d.y1 - d.y0 - 1)
      .attr("height", (d) => rectHeight(d))
      .attr("fill-opacity", 0.6)
      .attr("fill", (d) => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", clicked);

    const text = cell
      .append("text")
      .style("user-select", "none")
      .attr("pointer-es", "none")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", (d) => +labelVisible(d));

    text.append("tspan").text((d) => d.data.name);

    const tspan = text
      .append("tspan")
      .attr("fill-opacity", (d) => labelVisible(d) * 0.7)
      .text((d) => ` ${format(d.value)}`);

    cell.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    function clicked(e, p) {
      focus = focus === p ? (p = p.parent) : p;

      root.each(
        (d) =>
          (d.target = {
            x0: ((d.x0 - p.x0) / (p.x1 - p.x0)) * height,
            x1: ((d.x1 - p.x0) / (p.x1 - p.x0)) * height,
            y0: d.y0 - p.y0,
            y1: d.y1 - p.y0,
          })
      );

      const t = cell
        .transition()
        .duration(750)
        .attr("transform", (d) => `translate(${d.target.y0},${d.target.x0})`);

      rect.transition(t).attr("height", (d) => rectHeight(d.target));
      text.transition(t).attr("fill-opacity", (d) => +labelVisible(d.target));
      tspan
        .transition(t)
        .attr("fill-opacity", (d) => labelVisible(d.target) * 0.7);
    }

    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }

    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }
  }, [data]);

  return (
    <svg ref={svgRef} width={width} height={height}>
    </svg>
  );
}

export default ZoomableTreemap;