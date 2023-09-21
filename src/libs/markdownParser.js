var findType = function (line) {
  let type = -1;
  let i = 0;
  while (line.charAt(i) === "\t") i++;

  switch (line.charAt(i)) {
    case "#":
      {
        type = 0;
      }
      break;
    case "-":
      {
        type = 1;
      }
      break;
    default:
      type = -1;
  }
  return type;
};

var getTopicLevel = function (str) {
  let level = 0;
  if (str.charAt(0) === "#") {
    let i = 0;
    while (str.charAt(i++) === "#") level++;
  }
  return {
    level: level,
    title: str.slice(level).trim(),
  };
};

var findNodeTitle = function (str) {
  var index = str.indexOf("- ");

  if (index >= 0) {
    return {
      title: str.slice(index + 2).trim(),
      level: 10 + index,
    };
  } else {
    return false;
  }
};

export function parse(content) {
  var lastLevel = -1;
  var nodeStack = [];
  var nodes = [];
  var lastLevelStack = [];
  content.split("\n").forEach((line) => {
    if (line.length === 0) {
      return false;
    }
    let type = findType(line);

    switch (type) {
      case 0:
        {
          let { level, title } = getTopicLevel(line);
          if (level === 1) {
            let rootNode = {
              id: "root",
              topic: line.slice(2),
              isroot: true,
            };
            lastLevel = 1;
            nodes.push(rootNode);
            nodeStack.push(rootNode);
            lastLevelStack.push(1);
          } else {
            //while has no rooting
            if (nodes.length === 0) {
              let defaultRoot = {
                id: "root",
                topic: "",
                isroot: true,
              };
              nodes.push(defaultRoot);
              nodeStack.push(defaultRoot);
              lastLevelStack.push(1);
            }
            let lastNode = nodeStack[nodeStack.length - 1];
            let lastLevel = lastLevelStack[lastLevelStack.length - 1];
            while (level <= lastLevel && nodeStack.length > 0) {
              lastLevelStack.pop();
              lastLevel = lastLevelStack[lastLevelStack.length - 1];
              nodeStack.pop();
              lastNode = nodeStack[nodeStack.length - 1];
            }
            let node = {
              id: title.toLowerCase(),
              parentid: lastNode.id,
              topic: title.replace(
                title.charAt(0),
                title.charAt(0).toUpperCase()
              ),
            };
            nodes.push(node);
            nodeStack.push(node);
            lastLevelStack.push(level);
          }
        }
        break;
      case 1:
        {
          var rel = findNodeTitle(line);
          if (rel) {
            //while has no rooting
            if (nodes.length === 0) {
              let defaultRoot = {
                id: "root",
                topic: "",
                isroot: true,
              };
              nodes.push(defaultRoot);
              nodeStack.push(defaultRoot);
              lastLevelStack.push(1);
            }
            let { title, level } = rel;
            let lastNode = nodeStack[nodeStack.length - 1];
            let lastLevel = lastLevelStack[lastLevelStack.length - 1];
            while (level <= lastLevel && lastLevelStack.length > 0) {
              lastLevelStack.pop();
              lastLevel = lastLevelStack[lastLevelStack.length - 1];
              nodeStack.pop();
              lastNode = nodeStack[nodeStack.length - 1];
            }
            let node = {
              id: title.toLowerCase(),
              parentid: lastNode.id,
              topic: title.replace(
                title.charAt(0),
                title.charAt(0).toUpperCase()
              ),
            };
            nodes.push(node);
            nodeStack.push(node);
            lastLevelStack.push(level);
          }
        }
        break;
    }
  });
  return nodes;
}

// exports.parse = parse;
