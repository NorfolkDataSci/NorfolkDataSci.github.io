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
  this.pos = pos;
  this.lists = lists || [];
  this.cards = cards || [];
}

changeBoardName = function(container, board) {
  container.append(board.getName());
}

Board.prototype.getName = function(){
  return [
    '<a href="', this.url, '" target="_blank">',
      '<span>', this.name, '</span>',
    '</a>'
  ].join('');
}

Board.prototype.addCardsToContainer = function(container, cards) {
  cards.forEach(function(card) {
    container.append(card.getContainer());
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
  console.debug(toDoListId);
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
  this.desc = cutString(card.desc);
  this.shortUrl = card.shortUrl;
  this.comments = card.badges.comments;
}

Card.prototype.getContainer = function() {
  return this.cardContent();
}

Card.prototype.cardContent = function() {
  return [
   '<a href="', this.shortUrl, '" class="trello-card trello-clearfix" target="_blank">',
     '<span class="trello-card-labels trello-clearfix"></span>', 
     '<span href="', this.shortUrl, '" class="trello-card-title">', this.name, '</span>',
     '<span class="trello-card-badges">',
       '<span class="trello-card-badge">', 
         '<span class="trello-icon trello-icon-comment"></span>',
         '<span class="trello-badge-text">', this.comments,'</span>', 
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
  board.addCardsToContainer($('.trello-board' + pos + ' .trello-list-cards .to-do'), board.toDoCards());
  board.addCardsToContainer($('.trello-board' + pos + ' .trello-list-cards .in-progress'), board.inProgressCards());
  board.addCardsToContainer($('.trello-board' + pos + ' .trello-list-cards .done'), board.doneCards());
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