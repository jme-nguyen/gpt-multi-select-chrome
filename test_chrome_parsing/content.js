// Function to handle the keyboard shortcut
function handleKeydown(event) {
    // Check if Alt + G is pressed
    if (event.altKey && event.key === 'g') {
      // Get the selected text
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        cutText = selectedText.slice(2,-2);
        hightlightText(cutText);
      } else {
        console.log('No text selected.');
      }
    }
  }
  
  // Add event listener for keydown events
  document.addEventListener('keydown', handleKeydown);

  function hightlightText(searchText){
    searchNodes(document.body, searchText);
  }

  function searchNodes(node, searchText) {
    if (node.nodeType === Node.TEXT_NODE) {
        console.log(node.textContent);
        const startIndex = node.textContent.indexOf(searchText);
        if (startIndex!== -1) {
            const range = document.createRange();
            range.setStart(node, startIndex);
            range.setEnd(node, startIndex + searchText.length);
            console.log(range);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
        }
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let child of node.childNodes) {
            if (searchNodes(child, searchText)) {
                return true;
            }
        }
    }
    return false;
  }