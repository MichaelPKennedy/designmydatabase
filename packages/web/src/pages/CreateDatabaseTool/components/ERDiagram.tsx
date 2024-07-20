import React from "react";
import Mermaid from "react-mermaid2";
interface ERDiagramProps {
  result: {
    sqlCode: string;
    mermaidCode: string;
  };
}

const ERDiagram: React.FC<ERDiagramProps> = ({ result }) => {
  const { mermaidCode } = result;
  return <Mermaid chart={mermaidCode} />;
};

export default ERDiagram;
