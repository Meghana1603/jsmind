import React, { useEffect, useRef, useState } from "react";

const JSMindMM = ({ mind, styles, options, onClickCourse }) => {
  const jmContainer = useRef(null);
  const [jmInstance, setJmInstance] = useState(null)
  const [nodeClicked, setNodeClicked] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clickedNode, setClickedNode] = useState(null);

  useEffect(() => {
    const jm = new window.jsMind(options);
    jm.show(mind);
    setJmInstance(jm)

    const nodes = jm.view?.container.querySelectorAll("jmnode");

    const handleClick = (e) => {
      const selectedNode = jm.get_selected_node();
      if (selectedNode) {
        setClickedNode(jm.get_selected_node())
        setNodeClicked(true)
        setHoveredNode(null)
      }
    };

    const handleHover = (e) => {
      setHoveredNode(null)
      const targetNode = e.currentTarget;
      const nodeId = targetNode.getAttribute("nodeid");
      const node = jm.get_node(nodeId);
      targetNode.style.backgroundColor = node.data?.data?.backgroundColor;  
      if (!nodeClicked) {
        node.data?.data?.info?
          setHoveredNode(node):
          setHoveredNode(null)
      }
      else{
        setHoveredNode(null)
      }
    }

    const handleUnHover = (e) => {
      const targetNode = e.currentTarget;
      const nodeId = targetNode.getAttribute("nodeid");
      const node = jm.get_node(nodeId);
      targetNode.style.backgroundColor = node.data?.data?.backgroundColor; 
      }

    jmContainer.current.addEventListener("click", handleClick);
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", handleHover);
      node.addEventListener("mouseleave", handleUnHover);
      const styleNode = jm.get_node(node.getAttribute("nodeid"));
      node.style.backgroundColor = styleNode.data?.data?.backgroundColor;  
    });
  }, []);

  return (
    <div>
      <div ref={jmContainer} id={options.container} style={styles}></div>
      <div>
        {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            top: hoveredNode._data?.view?.abs_y+hoveredNode._data?.view?.height+10,
            left: hoveredNode._data?.view?.abs_x,
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
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px"
            }}
           >
          {hoveredNode.topic}
          <img width="12" height="12" src="https://img.icons8.com/small/16/delete-sign.png" alt="delete-sign" onClick={() => {
            setHoveredNode(null)
          }}/>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            {hoveredNode.data?.data?.info}
            <iframe width="60%" height="auto" 
              title="video"
              src="https://cdn2.percipio.com/secure/b/1695724082.9447dc700deb8f8b139c75933d0bd0d468e6dc7e/eot/c6647d06-b2c0-4f92-a5a3-ae59f7960792/720_2200kps.mp4" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      </div>
      <div>
        {nodeClicked && clickedNode && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            gap: "4px",
            top: clickedNode._data?.view?.abs_y-clickedNode._data?.view?.height-10,
            left: clickedNode._data?.view?.abs_x + (clickedNode._data?.view?.width)/2 - 62,
            width: 'auto',
            backgroundColor: "white",
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 2,
            boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
          }}
        >
            <img width="24" height="24" src="https://img.icons8.com/color/48/add--v1.png" alt="add--v1" onClick={(e) => {
            var new_node_id = clickedNode.id + '_' + new Date().getTime();  
            var new_node_topic = "This is a new node";  
            jmInstance.add_node(clickedNode.id, new_node_id, new_node_topic);
            jmInstance.begin_edit(jmInstance.get_node(new_node_id)); 
            const nodes = jmInstance.view?.container.querySelectorAll("jmnode");
            nodes.forEach((node) => {
              if(node.getAttribute("nodeid")===new_node_id) {
              const parentNode = jmInstance.get_node(clickedNode.id);
              node.style.backgroundColor = parentNode.children[0].data?.data?.backgroundColor;  
              }
            });
          }}/>
          { clickedNode.id !== "root" && (<img width="24" height="24" src="https://img.icons8.com/color/48/delete-forever.png" alt="delete-forever" onClick={() => {
            jmInstance.remove_node(clickedNode.id); 
            setNodeClicked(false)
            setHoveredNode(null)
          }}/>)}
          { clickedNode.data?.data?.url && (<img width="24" height="24" src="https://img.icons8.com/fluency/48/play.png" alt="play" onClick={() => {
            onClickCourse(jmInstance.get_selected_node())
          }}/>)}
          <img width="24" height="24" src="https://img.icons8.com/color/48/checked--v1.png" alt="checked--v1" onClick={() => {
            var existing_data = clickedNode.data?.data; 
            existing_data.backgroundColor = "green";
            jmInstance.update_node(clickedNode.id, clickedNode.topic, existing_data);  
            const nodes = jmInstance.view?.container.querySelectorAll("jmnode");
            nodes.forEach((node) => {
              if(node.getAttribute("nodeid")===clickedNode.id) {
              node.style.backgroundColor = "green";  
              }
            });
          }}/>
          
          <img width="12" height="12" src="https://img.icons8.com/small/16/delete-sign.png" alt="delete-sign" onClick={() => {
            setNodeClicked(false)
          }}/>
          <span style={{
            position: "absolute",
            bottom: "-10px",  
            left: "50px",  
            borderWidth: "10px 10px 0",  
            borderStyle: "solid",  
            borderColor: "#f9f9f9 transparent",  
            display: "block",  
            width: "0",  
          }}></span> 
        </div>
      )}
      </div>
    </div>
  );
};

export default JSMindMM;
