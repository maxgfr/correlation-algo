var Combinatorics = require('js-combinatorics');
var fs = require("fs");

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

var preset_pref = [
  'PhMoArDe',
  'PhFaPeLi',
  'PhArMoMu',
  'PhFoLiPe',
  'MoArMuNe',
  'MoArScFoDe',
  'MoPhMuLiDe',
  'MoScFoGa',
  'GaMoScSpCr',
  'GaScNeFoCr',
  'GaPhMoSpLi',
  'GaArMuLiDe',
  'ArMoMuLiDe',
  'ArPhPeLiFo',
  'ArMoPh',
  'ArScFoFa',
  'FaLiPhArDe',
  'FaGaLiBuDe',
  'FaPhMuPeLi',
  'FaPePhLiNe',
  'MuGaSpLi',
  'MuPhFaDeLi',
  'MuArMoPhFo',
  'MuPhGaPe',
  'ScArBuCr',
  'ScGaMoArCr',
  'ScGaSpNeBu',
  'ScSpCr',
  'SpNeLiFa',
  'SpPhPeFoBu',
  'SpGaNeBu',
  'SpFaPhScLi',
  'PePhArDe',
  'PeGaFoNe',
  'PePhMoLiBu',
  'PeLiFaPh',
  'LiFaArPh',
  'LiFoSpPh',
  'LiFoMoNe',
  'LiBuNeSpFo',
  'FoPhSpPe',
  'FoBuCrPhSc',
  'FoLiSpPhBu',
  'NeDeBuArMo',
  'NePeLiFa',
  'NeFaLiPh',
  'NeCrBuSpGa',
  'BuNeScCr',
  'BuCrNeSpGa',
  'BuScArFa',
  'BuSpGaNePh',
  'CrBuGaMo',
  'CrScGaMoBu',
  'CrPhSpBuSc',
  'DePhArLi',
  'DeNePhAr',
  'DePhMoFaLi',
  'DePhMoFa'
];

var user_1 = [ 'Ph', 'Mo', 'Ga', 'Ar', 'Fa' ];
var user_2 = [ 'Li', 'Fo', 'Ne' ];
var user_3 = [ 'Sc', 'Sp', 'Pe', 'Cr' ];

var mother_correspondance = {
  Ph: 'Image',
  Mo: 'Image',
  Ga: 'Ludique',
  Ar: 'Image',
  Fa: 'Lifestyle',
  Mu: 'Lifestyle',
  Sc: 'Ludique',
  Sp: 'Ludique',
  Pe: 'Lifestyle',
  Li: 'Lifestyle',
  Fo: 'Lifestyle',
  Ne: 'Actualite',
  Bu: 'Actualite',
  Cr: 'Actualite',
  De: 'Image'
}

//console.log(transfoUserArray(user_1));
findSimlarities(preferences, user_1, 70).then((res) => {console.log(res);})
//givePresetBucketWithString(preferences, transfoUserArray(user_3), preset_pref, 20 ).then((res) => {console.log(res);})
//givePresetBucket(preferences, user_3, preset_pref, 20).then((res) => {console.log(res.length);})
//console.log(motherBucker(mother_correspondance, user_3))
//createJsonPrefCombinatorics(preferences, './all_pref.json');
//readJsonPrefCombinatorics('./all_pref.json').then((res) => {console.log(res);});

function readJsonPrefCombinatorics(name_json) {
  return new Promise(resolve => {
    fs.readFile(name_json, 'utf-8', (err, data) => {
      if (err) {
          console.error(err);
          return;
      };
      resolve(JSON.parse(data));
    });
  });
}

function createJsonPrefCombinatorics(all_pref, name_json) {
  var cmb = Combinatorics.power(all_pref);
  var res = [];
  cmb.forEach((a) =>{
    res.push(a);
  });
  fs.writeFile(name_json, JSON.stringify(res, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
  });
}

function motherBucker (mother_correspondance, array_pref) {
  var bucket_to_publish = [];
  for(var i=0; i<array_pref.length; i++) {
    if(!bucket_to_publish.includes(mother_correspondance[array_pref[i]])) {
      bucket_to_publish.push(mother_correspondance[array_pref[i]]);
    }
  }
  return bucket_to_publish;
}

function givePresetBucketWithString(all_pref, bucketId, preset_arr, threshold) {
  return new Promise(resolve => {
    all_pref = all_pref.sort();
    var edit_pref = bucketId.split(/(?=[A-Z])/);
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
      if(new_array_preset_classify.includes(transfoUserArray(a)) && percent_sim >= threshold) {
        list_preset.push({id_bucket: transfoUserArray(a), percent_sim: percent_sim});
      }
      //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
    });
    resolve(list_preset.sort(compare));
  });
}

function givePresetBucket(all_pref, edit_pref, preset_arr, threshold) {
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
      if(new_array_preset_classify.includes(transfoUserArray(a)) && percent_sim >= threshold) {
        list_preset.push({id_bucket: transfoUserArray(a), percent_sim: percent_sim});
      }
      //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
    });
    resolve(list_preset.sort(compare));
  });
}

function findSimlarities(all_pref, edit_pref, threshold) {
  return new Promise(resolve => {
    all_pref = all_pref.sort();
    edit_pref = edit_pref.sort();
    var list_percent_sim = [];
    var cmb = Combinatorics.power(all_pref);
    cmb.forEach((a) =>{
      var percent_sim = percent_of_similarities(a, edit_pref);
      if(percent_sim >= threshold) {
        list_percent_sim.push({id_bucket: transfoUserArray(a), percent_sim: percent_sim});
      }
      //console.log('% of similarities between ['+a.toString()+'] & the user : '+percent_sim+ '%.')
    });
    resolve(list_percent_sim.sort(compare));
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
