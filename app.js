var Combinatorics = require('js-combinatorics');

var preferences = [
  'Ph', 'Mo', 'Ga',
  'Ar', 'Fa', 'Mu',
  'Sc', 'Sp', 'Pe',
  'Li', 'Fo', 'Ne',
  'Bu', 'Cr', 'De'
];

var equivalence_preferences = {
  Photo: 'Ph',
  Movies: 'Mo',
  Gaming: 'Ga',
  Arts: 'Ar',
  Fashion: 'Fa',
  Music: 'Mu',
  Science: 'Sc',
  Sports: 'Sp',
  Pets: 'Pe',
  Lifestyle: 'Li',
  Food: 'Fo',
  News: 'Ne',
  Business: 'Bu',
  Crypto: 'Cr',
  Design: 'De'
}

// Génération des utilisateurs
var user_1 = [ 'Ph', 'Mo', 'Ga', 'Ar', 'Fa' ];
var user_2 = [ 'Li', 'Fo', 'Ne' ];
var user_3 = [ 'Sc', 'Sp', 'Pe', 'Cr' ];

var preset_pref = [ 'CrFoScSp', 'PhMoArCr', 'FaFoPh'];

//console.log(transfoUserArray(user_1));
//findSimlarities(preferences, user_1, 70).then((res) => {console.log(res);})
givePresetBucket(preferences, user_1, preset_pref).then((res) => {console.log(res);})

function givePresetBucket(all_pref, edit_pref, preset_arr) {
  return new Promise(resolve => {
    all_pref = all_pref.sort();
    edit_pref = edit_pref.sort();
    var new_array_preset_classify = [];
    for(var i=0; i<preset_arr.length; i++) {
      var upperCaseArray = preset_arr[i].split(/(?=[A-Z])/);
      upperCaseArray.sort();
      new_array_preset_classify.push(upperCaseArray.join(''));
    }
    var list_preset = [];
    var cmb = Combinatorics.power(all_pref);
    cmb.forEach((a) =>{
      var percent_sim = percent_of_similarities(a, edit_pref);
      if(new_array_preset_classify.includes(transfoUserArray(a))) {
        list_preset.push({id_bucket: transfoUserArray(a), percent_sim: percent_sim});
      }
      //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
    });
    resolve(list_preset.sort(compare));
  });
}

function transfoUserArray(arr_usr) {
  var new_arr = arr_usr.sort();
  var string = '';
  for(var i=0; i<new_arr.length; i++) {
    string += new_arr[i];
  }
  return string;
}

function findSimlarities(all_pref, edit_pref, threshold) {
  return new Promise(resolve => {
    all_pref = all_pref.sort();
    edit_pref = edit_pref.sort();
    var list_percent_sim = [];
    var cmb = Combinatorics.power(all_pref);
    cmb.forEach((a) =>{
      var percent_sim = percent_of_similarities(a, edit_pref);
      if(percent_sim > threshold) {
        list_percent_sim.push({id_bucket: transfoUserArray(a), percent_sim: percent_sim});
      }
      //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
    });
    resolve(list_percent_sim.sort(compare));
  });
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
