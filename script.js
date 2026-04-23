class SmartRandom {
  constructor(n, historySize = 5) {
    this.n = n;
    this.history = [];
    this.historySize = historySize;
  }

  getNext() {
    const weights = [];

    for (let i = 0; i < this.n; i++) {
      // count how many times i appears in recent history
      const count = this.history.filter(x => x === i).length;

      // higher count = lower weight
      const weight = 1 / (1 + count);
      weights.push(weight);
    }

    // weighted random selection
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;

    for (let i = 0; i < this.n; i++) {
      r -= weights[i];
      if (r <= 0) {
        this._addToHistory(i);
        return i;
      }
    }
  }

  _addToHistory(value) {
    this.history.push(value);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }
  }
}

let rng;
let jsonData;

$.getJSON("./data.json", function(data) {
    console.log(data);
    const result = Math.floor(Math.random() * data.length);    
    console.log(result);
    rng = new SmartRandom(data.length);
    jsonData = data;
});

let selectedData;
let selectedCharacter;
let savedWriter = "";

$(document).ready(function() {
    $("#writer").val("");
    $("#genre").val("");
    $("#date").val("");
    $("#title").val("");

    $("#random").click(function() {
        const randomIndex = rng.getNext();
        console.log(randomIndex);
        console.log(jsonData[randomIndex]);
        selectedData = jsonData[randomIndex];
        selectedCharacter = selectedData.characters[Math.floor(Math.random() * selectedData.characters.length)];
        console.log(selectedCharacter);
        setValues(selectedData, selectedCharacter);
        savedWriter = $("#writer").val();

        $("#writer").val("");
        $("#genre").val("");
        $("#date").val("");
        $("#title").val("");
    });

    $("#check").click(function() {
        if (selectedData === undefined || selectedCharacter === undefined) {
            return;
        } else {
            showAnswer(selectedData, selectedCharacter);
        }        
    });

    $("#previousWriter").click(function() {
        $("#writer").val(savedWriter);
    });

});

function setValues(data, character) {
    $(".answer").text("Megoldás itt jelenik meg");
    $("h3").text(character);
}

function showAnswer(data, character) {
    $("#titleAnswer").text(data.title);
    $("#writerAnswer").text(data.author);
    $("#genreAnswer").text(data.genre);
    $("#dateAnswer").text(data.date);
}