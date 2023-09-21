import { v4 as uuidv4 } from "uuid";

/**
 * Find the outline level and title
 * @param {string} line  Content's line
 * @returns {object|boolean} Return the outline level and the title
 */

function findNode(line, nodeType) {
  var index = line.indexOf(nodeType);
  if (index >= 0) {
    return {
      title: line.slice(index + 1).trim(),
      level: nodeType + "," + index,
    };
  } else {
    return false;
  }
}
/**
 *
 * @param {string} level
 * @param {string} lastLevel
 * @param {string} matchMap the object saving the order of tags
 * @returns {number}
 */

function compareLevel(level, lastLevel, matchMap) {
  if (lastLevel === "root") return 1;
  let p = level.split(",");
  let q = lastLevel.split(",");
  let flagCompare = matchMap[p[0]] - matchMap[q[0]];
  if (flagCompare === 0) {
    return parseInt(p[1]) - parseInt(q[1]);
  }
  return flagCompare;
}

const Status = {
  "-": 0,
};
// "·": 0

// const preProcessContent = (text) => {
//   var inputArray = text.split("\n");
//   var filteredArray = inputArray.filter(function (rowString) {
//     console.log(rowString);
//     return rowString;
//   });
//   return filteredArray.join("\n");
// };
/**
 *
 * @param {string} content
 * @param {object} matchMap a match map to tell the function how to classify and match the content
 * @returns {Array}
 */
export function parse(content, matchMap = Status) {
  //content = preProcessContent(content);

  if (typeof matchMap !== "object") {
    throw new Error("match must be a object saving the order of tags");
  }
  //split the content by line
  let nodes = [];
  let nodeStack = [];
  let lastNodeLevelStack = [];
  //the tags will be matched
  let filterArr = Object.keys(matchMap);
  let root = {
    id: "root",
    topic: "Map",
    isroot: true,
  };
  //set a initial root node
  nodes.push(root);
  nodeStack.push(root);
  lastNodeLevelStack.push("root");
  content.split("\n").forEach((line) => {
    // console.log(line);
    // console.log(
    //   // "nodes",
    //   // nodes,
    //   // "nodeStack",
    //   // nodeStack,
    //   "lastNodeLevelStack",
    //   lastNodeLevelStack
    // );
    //match the first non-numeric and non-letter character
    let index = line.search(filterArr);
    let firstLetterIndex = line.search(/[^\w\s]/);
    //only the first non-numeric and non-letter character is the letter you'd like to matching will push it in array
    //so set this flag
    let matchFlag = index === firstLetterIndex && index !== -1;
    // for the case, if line starts from another symbol than supported ones
    // in this case add to the start of line just standard outliner symbol
    if (!matchFlag) {
      line = `- ${line}`;
      index = line.search(filterArr);
      firstLetterIndex = line.search(/[^\w\s]/);
      matchFlag = index === firstLetterIndex && index !== -1;
    }
    //this line's type
    let type = line.charAt(index);
    //pick up level and text from the line
    let rel = findNode(line, type);
    if (rel && matchFlag && rel.title.trim().length > 0) {
      let { title, level } = rel;
      //use stack to save last node and level
      let lastNode = nodeStack[nodeStack.length - 1];
      let lastLevel = lastNodeLevelStack[lastNodeLevelStack.length - 1];
      //find the parent node
      while (
        compareLevel(level, lastLevel, matchMap) <= 0 &&
        nodeStack.length > 0
      ) {
        lastNodeLevelStack.pop();
        lastLevel = lastNodeLevelStack[lastNodeLevelStack.length - 1];
        nodeStack.pop();
        lastNode = nodeStack[nodeStack.length - 1];
      }

      //saving the node
      let node = {
        id: title.toLowerCase() + "_" + uuidv4(),
        parentid: lastNode.id,
        topic: title, // .replace(title.charAt(0), title.charAt(0).toUpperCase()),
      };
      nodes.push(node);
      nodeStack.push(node);
      lastNodeLevelStack.push(level);
    }
  });
  return nodes;
}

//exports.parse = parse;
