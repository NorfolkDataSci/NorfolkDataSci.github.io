function cutString(text){    
    var wordsToCut = 5;
    var wordsArray = text.split(" ");
    if(wordsArray.length>wordsToCut){
        var strShort = "";
        for(i = 0; i < wordsToCut; i++){
            strShort += wordsArray[i] + " ";
        }   
        return strShort+"&hellip;";
    }else{
        return text;
    }
 };
         
Board = function(name, url, pos, lists, cards) {
  this.name = name;
  this.url = url;
  this.github_url = 'https://github.com/NorfolkDataSci/' + name;
  this.pos = pos;
  this.lists = lists || [];
  this.cards = cards || [];
}

changeBoardName = function(container, board) {
  container.append(board.getName());
}

Board.prototype.getName = function(){
  return [
    '<div style="font-size:1.3em;"><u><b>Project</b>: ', this.name, '</u></div>',
    '<img class="valign" src="../images/trello-logo.png" width="18px" height="18px">',
    '<a class="valign" href="', this.url, '" target="_blank">   View Trello Board</a>',
    '<img class="valign" src="../images/github-logo.png" width="18px" height="18px" style="margin-left:20px;">',
    '<a class="valign" href="', this.github_url, '" target="_blank">   View on GitHub</a>'
  ].join('');
}

Board.prototype.addCardsToContainer = function(container, cards) {
  cards.forEach(function(card) {
    container.append(card.cardContent());
  });
}

Board.prototype.toDoCards = function() {
  todo = [];
  var toDoListId;
  this.lists.forEach(function(list) {
    if (list.name == 'Backlog') {
      toDoListId = list.id;
    }
  });
  // this.lists - figure out id for 
  this.cards.forEach(function(card) {
    if (card.idList == toDoListId) {
      todo.push(card);
    }
  });
  return todo;
}
Board.prototype.inProgressCards = function() {
  inprogress = [];
  var inProgressListId;
  this.lists.forEach(function(list) {
    if (list.name == 'In Progress Start') {
      inProgressListId = list.id;
    }
  });
  // this.lists - figure out id for 
  this.cards.forEach(function(card) {
    if (card.idList == inProgressListId) {
      inprogress.push(card);
    }
  });
  return inprogress;
}
Board.prototype.doneCards = function() {
  done = [];
  var doneListId;
  this.lists.forEach(function(list) {
    if (list.name == 'Close list') {
      doneListId = list.id;
    }
  });
  // this.lists - figure out id for 
  this.cards.forEach(function(card) {
    if (card.idList == doneListId) {
      done.push(card);
    }
  });
  return done;
}

Card = function(card) { 
	this.id = card.id;
  this.name = card.name;
  this.shortUrl = card.shortUrl;
}

Card.prototype.cardContent = function() {
  return [
   '<a href="', this.shortUrl, '" class="trello-card trello-clearfix" target="_blank">',
     '<span class="trello-card-labels trello-clearfix"></span>', 
     '<span href="', this.shortUrl, '" class="trello-card-title">', this.name, '</span>',
     '<span class="trello-card-badges">',
       '<span class="trello-card-badge">', 
         '<span class="trello-icon trello-icon-comment"></span>',
         '<span class="trello-badge-text">1</span>', 
       '</span>',
     '</span>',
     '<span class="trello-card-members"></span>',
    '</a>'
  ].join('');
}

List = function(list) {
  this.id = list.id;
  this.name = list.name;
  this.featured = true;
}

function loadCardData(name, url, pos, listData, cardData) {
  var board = new Board(name, url, pos);
  board.lists = [];
  board.cards = [];
  listData.forEach(function(listDatum) {
    board.lists.push(new List(listDatum));
  });
  cardData.forEach(function(cardDatum) {
    board.cards.push(new Card(cardDatum));
  });
	
	$('.trello-board' + pos + ' .trello-board-header').empty();
  $('.trello-board' + pos + ' .trello-list-cards .to-do').empty();
  $('.trello-board' + pos + ' .trello-list-cards .in-progress').empty();
  $('.trello-board' + pos + ' .trello-list-cards .done').empty();

  changeBoardName($('.trello-board' + pos + ' .trello-board-header'), board);
  board.addCardsToContainer($('#todolist' + pos), board.toDoCards());
  board.addCardsToContainer($('#inprogresslist' + pos), board.inProgressCards());
  board.addCardsToContainer($('#donelist' + pos), board.doneCards());
}

function getAllData(url, pos, callback) {
  var this_board_name = '';
  var this_board_url = '';
  var this_board_pos = pos;
  var lists = [];
  var cards = [];
  $.getJSON(url).success(function(responseObj) {
    this_board_name = responseObj.name;
    this_board_url = responseObj.url;
    responseObj.lists.forEach(function(resultDatum){
      lists.push(resultDatum);
    });
    responseObj.cards.forEach(function(resultDatum){
      cards.push(resultDatum);
    });
  	callback(this_board_name, this_board_url, this_board_pos, lists, cards);
  });
}

function getTrelloLists(url, pos, callback) {
  getAllData(url, pos, callback);
}

$(document).ready(function() {
  getTrelloLists('https://trello.com/b/mF8YgX8R.json', 1, loadCardData);
  getTrelloLists('https://trello.com/b/mF8YgX8R.json', 2, loadCardData);
});