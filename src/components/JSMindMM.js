import React, { useEffect, useRef, useState } from "react";

const JSMindMM = ({ mind, styles, options, onClick }) => {
  const jmContainer = useRef(null);
  const [nodeClicked, setNodeClicked] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);


  useEffect(() => {
    const jm = new window.jsMind(options);
    jm.show(mind);

    const nodes = jm.view.container.querySelectorAll("jmnode");

    const handleClick = (e) => {
      const selectedNode = jm.get_selected_node();
      if (selectedNode) {
        setNodeClicked(true)
        onClick(e, selectedNode);
      }
    };

    const handleHover = (e) => {
      if (!nodeClicked) {
        const targetNode = e.currentTarget;
        const nodeId = targetNode.getAttribute("nodeid");
        const node = jm.get_node(nodeId);
        node.data.data?.info?
          setHoveredNode(node):
          setHoveredNode(null)
      }
    }

    const handleUnHover = () => {
        setHoveredNode(null)
      }

    jmContainer.current.addEventListener("click", handleClick);
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", handleHover);
      node.addEventListener("mouseleave", handleUnHover);
    });

    return () => {
      jmContainer.current.removeEventListener("click", handleClick);
      jm.reset(); // Cleanup when component unmounts
    };
  }, []);

  return (
    <div>
      <div ref={jmContainer} id={options.container} style={styles}></div>
      <div>
        {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            top: hoveredNode._data.view.abs_y+hoveredNode._data.view.height+10,
            left: hoveredNode._data.view.abs_x,
            width: '570px',
            backgroundColor: "white",
            // padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 2,
            boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px"
            }}
           >
          {hoveredNode.topic}
          </div>
          {hoveredNode.data.data.info}
        </div>
      )}
      </div>
    </div>
  );
};

export default JSMindMM;
