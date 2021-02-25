"use strict";

function connectMultiplePegsToNewPeg() {
    var newPegX = 0;
    var newPegY = Number.POSITIVE_INFINITY;
    var totalX = 0;
    var newPegName = "New_Peg";
    var newPegPath = "";
    var selectedNodes = [];

    scene.beginUndoRedoAccum("ConnectMultiplePegsToNewPeg");

    selectedNodes = selection.selectedNodes();

    if (selectedNodes.length < 1) {
        MessageBox.information("Please select a Peg node");
        return;
    }
    
    if (!selectedNodes.every(function(n) {
        return node.type(n) === "PEG";
    })) {
        MessageBox.information("Please select only Peg nodes");
        return;
    }

    selectedNodes.sort(function(a, b) {
        return node.coordX(a) - node.coordX(b);
    });
    
    selectedNodes.forEach(function(n) {
        totalX += node.coordX(n);
        if (node.coordY(n) < newPegY) {
            newPegY = node.coordY(n);
        }
    });

    newPegX = totalX / selectedNodes.length;

    newPegPath = node.add(node.parentNode(selectedNodes[0]), newPegName, "PEG", newPegX, newPegY - 50, 0);

    selectedNodes.forEach(function(n) {
        if (!node.link(newPegPath, 0, n, 0, false, false)) {
            MessageBox.information("Could not connect the new Peg to " + n);
        }
    });

    scene.endUndoRedoAccum();
}
