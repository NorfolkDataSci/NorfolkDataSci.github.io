
Board = function(name, lists, cards) {
  this.name = name;
  this.lists = lists || [];
  this.cards = cards || [];
}

Board.prototype.addCardsToContainer = function(container, cards) {
  cards.forEach(function(card, i) {
    container.append(card.getContainer(i+1));
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
  this.desc = card.desc;
  this.shortUrl = card.shortUrl;
  this.idList = card.idList;
}

Card.prototype.getContainer = function(index) {
  var last = '';
  if (index % 4 == 0) { last = 'last-in-row' }

  return [
    '<div class="project island-light island-stack island ', this.id, ' ', last, '">',
      this.cardContent(),
    '</div>'
  ].join('');
}

Card.prototype.cardContent = function() {
  return [
    '<div class="island-item">',
      '<h3>',
        '<a href="', this.shortUrl, '" target="_blank">', this.name, '</a>',
      '</h3>',
      '<div class="repo-info">',
        '<span class="language">', this.id, '</span>',
        '<span class="language">', this.idList, '</span>',
      '</div>',
      '<p>', this.desc, '</p>',
    '</div>'
  ].join('');
}

List = function(list) {
  this.id = list.id;
  this.name = list.name;
  this.featured = true;
}

function loadCardData(listData, cardData) {
  var board = new Board('norfolkdatasci');
  board.lists = [];
  board.cards = [];
  listData.forEach(function(listDatum) {
    board.lists.push(new List(listDatum));
  });
  cardData.forEach(function(cardDatum) {
    board.cards.push(new Card(cardDatum));
  });
	
  $('.projects .to-do').empty();
  $('.projects .in-progress').empty();
  $('.projects .done').empty();

  board.addCardsToContainer($('.projects .to-do'), board.toDoCards());
  board.addCardsToContainer($('.projects .in-progress'), board.inProgressCards());
  board.addCardsToContainer($('.projects .done'), board.doneCards());
}

function getAllData(url, callback) {
  var lists = [];
  var cards = [];
  $.getJSON(url).success(function(responseObj) {
    responseObj.lists.forEach(function(resultDatum){
      lists.push(resultDatum);
    });
    responseObj.cards.forEach(function(resultDatum){
      cards.push(resultDatum);
    });
    alert(lists.length);
    alert(cards.length);
  	callback(lists, cards);
  });
}

function getTrelloLists(callback) {
  getAllData('https://trello.com/b/mF8YgX8R.json', callback);
}

$(document).ready(function() {
  getTrelloLists(loadCardData);
});