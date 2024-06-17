// Function to handle the keyboard shortcut
function handleKeydown(event) {
    // Check if Alt + G is pressed
    if (event.altKey && event.key === 'g') {
      // Get the selected text
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        // cutText = selectedText.slice(295,-58);
        // console.log(cutText);
        // refineSelection(cutText);
        gptProcessing(selectedText);
      } else {
        console.log('No text selected.');
      }
    }
  }
  
  // Add event listener for keydown events
document.addEventListener('keydown', handleKeydown);

function refineSelection(substring) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const startIndex = selectedText.indexOf(substring);

      if (startIndex !== -1) {
          const start = findNodeAtOffset(range, startIndex);
          const end = findNodeAtOffset(range, startIndex + substring.length);

          if (start && end) {
              const newRange = document.createRange();
              newRange.setStart(start.node, start.offset);
              newRange.setEnd(end.node, end.offset);
              
              selection.removeAllRanges();
              selection.addRange(newRange);
          }
      }
  }
}

function findNodeAtOffset(range, targetOffset) {
  let currentNode = range.startContainer;
  let currentOffset = range.startOffset;

  while (currentNode && targetOffset > 0) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
          const textLength = currentNode.textContent.length;
          if (targetOffset <= textLength) {
              return { node: currentNode, offset: currentOffset + targetOffset };
          } else {
              targetOffset -= (textLength - currentOffset);
              currentOffset = 0;
              currentNode = nextNode(currentNode);
          }
      } else {
          currentNode = nextNode(currentNode);
      }
  }

  return null;
}

function nextNode(node) {
  if (node.firstChild) {
      return node.firstChild;
  }
  while (node) {
      if (node.nextSibling) {
          return node.nextSibling;
      }
      node = node.parentNode;
  }
  return null;
}

function gptProcessing(question) {
  fetch('https://gpt-multi-select-chrome.onrender.com/multi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(result => refineSelection(result))
    .catch(error => {
      console.error('Error:', error);
    })
}