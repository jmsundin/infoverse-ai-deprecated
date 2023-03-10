import { useState, useCallback } from "react";
import VisNetworkGraph from "./VisNetworkGraph";
import GraphD3 from "./GraphD3";
import TreeD3 from "./TreeD3";
import ZoomableTreemap from "./ZoomableTreemap";
import SunburstD3 from "./SunburstD3";
import Table from "./Table";
import VisNetworkParams from "../utils/Helper/VisNetworkParams";

import "../assets/Canvas.css";

const Canvas = (props) => {
  const data = props.data;
  const [networkNodes, setNetwortNodes] = useState([]);
  const chart = props.chart;
  const chosenTopic = props.chosenTopic;
  const chosenProperty = props.chosenProperty;

  const getNodes = useCallback((a) => {
    setNetwortNodes(a);
  }, []);

  // console.log("Canvas data: ", JSON.stringify(data));

  const chartHandler = (chart) => {
    switch (chart) {
      case "Network Diagram":
        return (
          <VisNetworkGraph
            data={data}
            options={VisNetworkParams.options}
            events={VisNetworkParams.events}
            getNodes={getNodes}
            width="100%"
            height="100%"
          />
        );
      case "Graph (D3 Network)":
        return (
          <GraphD3
            data={data}
            chosenTopic={chosenTopic}
            chosenProperty={chosenProperty}
            width="100%"
            height="100%"
          />
        );
      case "Tree Chart":
        return (
          <TreeD3
            data={data}
            chosenTopic={chosenTopic}
            chosenProperty={chosenProperty}
            width="100%"
            height="100%"
          />
        );
      case "Zoomable Treemap":
        return (
          <ZoomableTreemap
            data={data}
            chosenTopic={chosenTopic}
            chosenProperty={chosenProperty}
            width="100%"
            height="100%"
          />
        );
      case "Sunburst (D3)":
        return (
          <SunburstD3
            data={data}
            chosenTopic={chosenTopic}
            chosenProperty={chosenProperty}
            width="100%"
            height="100%"
          />
        );
      case "Table":
        return (
          <Table
            data={data}
            chosenTopic={chosenTopic}
            chosenProperty={chosenProperty}
            width="100%"
            height="100%"
          />
        );
    }
  };

  return <div className="canvas">{chartHandler(chart)}</div>;
};

export default Canvas;
