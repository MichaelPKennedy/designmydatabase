import React from "react";
import MermaidDiagram from "./MermaidDiagram";

interface ERDiagramProps {
  result: {
    mermaidCode: string;
  };
}

const ERDiagram: React.FC<ERDiagramProps> = ({ result }) => {
  return (
    <div>
      <h2>Entity Relationship Diagram</h2>
      <MermaidDiagram chartDefinition={result.mermaidCode} />
    </div>
  );
};

export default ERDiagram;
