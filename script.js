function OnCheck() {}

document.addEventListener("DOMContentLoaded", function(event) {
	var checkboxes = {
		"owner_read":document.getElementById("owner-read"),
	  "owner_write":document.getElementById("owner-write"),
	  "owner_execute":document.getElementById("owner-execute"),
	  "group_read":document.getElementById("group-read"),
	  "group_write":document.getElementById("group-write"),
	  "group_execute":document.getElementById("group-execute"),
	  "public_read":document.getElementById("public-read"),
	  "public_write":document.getElementById("public-write"),
	  "public_execute":document.getElementById("public-execute")
	};

  var permission_code = document.getElementById("permission-code"),
  	  permission_text = document.getElementById("permission-text"),
      codecopy = document.getElementById("codecopy"),
      textcopy = document.getElementById("textcopy"),
      share = document.getElementById("share");

  var permissions_codes = {
  	0:"-,-,-",
  	1:"-,-,execute",
  	2:"-,write,-",
  	3:"-,write,execute",
  	4:"read,-,-",
  	5:"read,-,execute",
  	6:"read,write,-",
  	7:"read,write,execute"
  };

  var permissions_codes_reverse = {
  	"-,-,-":0,
  	"-,-,execute":1,
  	"-,write,-":2,
  	"-,write,execute":3,
  	"read,-,-":4,
  	"read,-,execute":5,
  	"read,write,-":6,
  	"read,write,execute":7
  };

  var text_codes = {
  	"-":"-",
  	"read":"r",
  	"write":"w",
  	"execute":"x"
  };

  var text_codes_reverse = {
  	"-":"-",
  	"r":"read",
  	"w":"write",
  	"x":"execute"
  }

  var checkboxes_ids = {
  	0:"owner",
  	1:"group",
  	2:"public"
  };

  var letters_ids = {
  	0:"r",
  	1:"w",
  	2:"x"
  }

  var allowed_letters = {
  	"-":true,
  	"r":true,
  	"w":true,
  	"x":true
  };

  function get(name){
	  if(name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
	  	return decodeURIComponent(name[1]);
	  } else {
	  	return false;
	  }
	}

  function UncheckAll() {
  	for(var key in checkboxes) {
  		checkboxes[key].checked = false;
		}
  };

  share.onclick = function() {
  	var json_data = {};
  	var i = 0;
  	for(var key in checkboxes) {
  		if(checkboxes[key].checked) {
  			// json_data.push(key);
  			json_data[i] = key;
  			i++;
  		}
  	}
  	json_data = JSON.stringify(json_data);
  	if(json_data == '{}') {return;}
  	navigator.clipboard.writeText("https://unixpermissions.ru?data=" + json_data);
  }

  codecopy.onclick = function() {
    navigator.clipboard.writeText(permission_code.value)
  }

  textcopy.onclick = function() {
    navigator.clipboard.writeText(permission_text.value)
  }

  permission_code.oninput = function() {
  	var code_arr = permission_code.value.split("");
  	var text_value = "";
  	for(var key in code_arr) {
  		if(isNaN(code_arr[key])) {UncheckAll(); permission_text.value = ""; return;}
  		if(permission_code.value > 777) {UncheckAll(); permission_text.value = ""; return;}
  		if(code_arr.length < 3) {UncheckAll(); permission_text.value = ""; return;}
  		var textcode_arr = permissions_codes[code_arr[key]].split(",");
  		for(var kkey in textcode_arr) {
  			if(textcode_arr[kkey] != '-') {
  				checkboxes[checkboxes_ids[key] + '_' + textcode_arr[kkey]].checked = true;
  			}
  			text_value = text_value + text_codes[textcode_arr[kkey]];
  		}
  	}
  	permission_text.value = text_value;
  };

  permission_text.oninput = function() {
  	if(permission_text.value.length < 9) {UncheckAll(); permission_code.value = ""; return;}
  	var textcode_arr = permission_text.value.toLowerCase().split(/(?=(?:...)*$)/);
  	var need_cbs = {};
  	for(var key in textcode_arr) {
  		var textcode_one_arr = textcode_arr[key].split("");
  		for(var kkey in textcode_one_arr) {
  			if(!allowed_letters[textcode_one_arr[kkey]]) {UncheckAll(); permission_code.value = ""; return;}
  			if(textcode_one_arr[kkey] != letters_ids[kkey] && textcode_one_arr[kkey] != "-") {UncheckAll(); permission_code.value = ""; return;}
  			if(textcode_one_arr[kkey] == "-") {
  				need_cbs[checkboxes_ids[key] + "_" + text_codes_reverse[letters_ids[kkey]]] = textcode_one_arr[kkey];
  			} else {
  				need_cbs[checkboxes_ids[key] + "_" + text_codes_reverse[textcode_one_arr[kkey]]] = textcode_one_arr[kkey];
  			}
  		}
  	}
  	if(need_cbs.length < 9) {UncheckAll(); permission_code.value = ""; return;}
  	for(var key in need_cbs) {
  		if(need_cbs[key] != "-") {
  			checkboxes[key].checked = true;
  		}
  	}
  	var perm_code = "";
  	for(var key in textcode_arr) {
  		var first_code = "";
  		var textcode_one_arr = textcode_arr[key].split("");
  		for(var kkey in textcode_one_arr) {
  			if(textcode_one_arr.length - 1 == kkey) {
  				first_code = first_code + text_codes_reverse[textcode_one_arr[kkey]];
  			} else {
  				first_code = first_code + text_codes_reverse[textcode_one_arr[kkey]] + ',';
  			}
  		}
  		perm_code = perm_code + permissions_codes_reverse[first_code];
  	}
  	permission_code.value = perm_code;
  }

	OnCheck = function() {
		var checked_perms = {};
		for(var key in checkboxes) {
			if(checkboxes[key].checked) {
				checked_perms[key] = text_codes[key.split("_").pop()];
			} else {
				checked_perms[key] = "-";
			}
		}
		var text_code = "";
		for(var key in checked_perms) {
			text_code = text_code + checked_perms[key];
		}
		permission_text.value = text_code;
		var textcode_arr = permission_text.value.toLowerCase().split(/(?=(?:...)*$)/);
		var perm_code = "";
  	for(var key in textcode_arr) {
  		var first_code = "";
  		var textcode_one_arr = textcode_arr[key].split("");
  		for(var kkey in textcode_one_arr) {
  			if(textcode_one_arr.length - 1 == kkey) {
  				first_code = first_code + text_codes_reverse[textcode_one_arr[kkey]];
  			} else {
  				first_code = first_code + text_codes_reverse[textcode_one_arr[kkey]] + ',';
  			}
  		}
  		perm_code = perm_code + permissions_codes_reverse[first_code];
  	}
  	permission_code.value = perm_code;
	}
	
	if(get("data") != false) {
		data = JSON.parse(get("data"));
		for(var key in data) {
			if(typeof checkboxes[data[key]] !== 'undefined') {
				checkboxes[data[key]].checked = true;
			}
		}
		OnCheck();
	}
});