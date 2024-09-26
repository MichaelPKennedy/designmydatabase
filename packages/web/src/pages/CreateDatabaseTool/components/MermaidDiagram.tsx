import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import styled from "styled-components";
import "./MermaidDiagram.css";

interface MermaidDiagramProps {
  chartDefinition: string;
  onSvgRendered: (svg: SVGSVGElement | null, error: Error | null) => void;
}

const DiagramContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
`;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chartDefinition,
  onSvgRendered,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      mermaid
        .render("mermaid-diagram", chartDefinition)
        .then((result) => {
          if (elementRef.current) {
            elementRef.current.innerHTML = result.svg;
            const svgElement = elementRef.current.querySelector("svg");
            if (svgElement) {
              // Make the SVG responsive
              svgElement.setAttribute("width", "100%");
              svgElement.setAttribute("height", "auto");
              svgElement.style.maxWidth = "100%";
            }
            onSvgRendered(svgElement as SVGSVGElement, null);
          }
        })
        .catch((error) => {
          onSvgRendered(null, error);
        });
    }
  }, [chartDefinition, onSvgRendered]);

  return <DiagramContainer ref={elementRef} />;
};

export default MermaidDiagram;
