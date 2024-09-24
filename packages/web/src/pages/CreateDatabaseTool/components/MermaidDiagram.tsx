import React from "react";
import Mermaid from "react-mermaid2";
import styled from "styled-components";
import "./MermaidDiagram.css";

interface MermaidDiagramProps {
  chartDefinition: string;
}

const DiagramContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
`;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chartDefinition }) => {
  return (
    <DiagramContainer>
      <Mermaid
        chart={chartDefinition}
        config={{
          theme: "default",
          startOnLoad: true,
          securityLevel: "loose",
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
          },
        }}
      />
    </DiagramContainer>
  );
};

export default MermaidDiagram;
