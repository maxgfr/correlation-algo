var Combinatorics = require('js-combinatorics');

// Génération des préférences
var preferences = [
  'Math',
  'Physique',
  'Chimie',
  'Français',
  'Anglais',
  'Chinois',
  'Japonais',
  'Geo',
  'Histoire',
  'Sport',
  'Musique',
  'Latin',
  'Grec',
  'Italien',
  'Economie'
];

// Génération des utilisateurs
var user_1 = [ 'Math', 'Physique', 'Français', 'Japonais', 'Sport' ];
var user_2 = [ 'Anglais', 'Latin', 'Grec' ];
var user_3 = [ 'Math', 'Chinois', 'Economie' ];
var user_4 = [ 'Math', 'Physique', 'Chimie', 'Geo' ];

//console.log(findSimlarities(preferences, user_4, 70).length);
console.log(findSimlarities(preferences, user_1, 70));

function findSimlarities(all_pref, edit_pref, threshold) {
  var cmb = null;
  var j = 0;
  var name_bucket = {};
  var final_res = {};
  var list_percent_sim = [];
  cmb = Combinatorics.power(all_pref);
  cmb.forEach((a) =>{
    var percent_sim = percent_of_similarities(a, edit_pref);
    if(percent_sim > threshold) {
      list_percent_sim.push({id_bucket: j, percent_sim: percent_sim});
    }
    //name_bucket[a] = j;
    j++;
    //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
  });
  return list_percent_sim.sort(compare);
}

function compare(a,b) {
  if (a.percent_sim < b.percent_sim)
    return 1;
  if (a.percent_sim > b.percent_sim)
    return -1;
  return 0;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function percent_of_similarities(arrayA, arrayB) {
    var matches = 0;
    var res = 0;
    if(arrayA.length > arrayB.length) {
      for (i=0;i<arrayA.length;i++) {
          if (arrayB.indexOf(arrayA[i]) != -1)
              matches++;
      }
      res = (matches / arrayA.length) * 100;
    } else {
      for (i=0;i<arrayB.length;i++) {
          if (arrayA.indexOf(arrayB[i]) != -1)
              matches++;
      }
      res = (matches / arrayB.length) * 100;
    }
    return res;
}
