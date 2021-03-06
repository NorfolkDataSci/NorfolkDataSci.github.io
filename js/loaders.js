function getAllPages(urlPrefix, callback, page, results) {
  page = page || 1;
  results = results || [];

  var url = urlPrefix + '?per_page=100&page=' + parseInt(page);

  $.get(url, function(data) {
    if (data.length > 0) {
      data.forEach(function(resultDatum) {
        results.push(resultDatum);
      });
      getAllPages(urlPrefix, callback, page + 1, results);
    }
    else {
      callback(results);
    }
  });
}

function getGithubRepos(callback, page, repos) {
  getAllPages('https://api.github.com/users/norfolkdatasci/repos', callback);
}

function getGithubMembers(callback) {
  getAllPages('https://api.github.com/orgs/norfolkdatasci/members', callback);
}

function loadRepositoryData(repoData) {
  var org = new Organization('norfolkdatasci');
  org.repos = [];

  repoData.forEach(function(repoDatum) {
    org.repos.push(new Repository(repoDatum));
  });

  $('.projects .popular').empty();
  $('.projects .not-popular').empty();

  org.addReposToContainer($('.projects .popular'), org.featuredRepos());
  org.addReposToContainer($('.projects .not-popular'), org.regularRepos());

  $('.project-count').html(org.repos.length);
}

function loadMemberData(members) {
  $('.dev-count').html(members.length);
}

$(document).ready(function() {
  getGithubRepos(loadRepositoryData);
  getGithubMembers(loadMemberData);
});


// vim: sw=2 sts=2 expandtab
