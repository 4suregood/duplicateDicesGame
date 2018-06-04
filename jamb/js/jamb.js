
//<tr>
//  <td class="active">...</td>
//  <td class="success">...</td>
//  <td class="warning">...</td>
//  <td class="danger">...</td>
//  <td class="info">...</td>
//</tr>

var IDS_SUFFIXES = ["1","2","3","4","5","6","Max","Min","Str","Full","Poker","Jamb"];
var gClickCounter = 0;
var gDices = [];//to be used when cell is clicked.
var gNid = "";
var START_BOARD = [
	 {id: "d1", cssClass: "editable"}   ,{id: "f1", cssClass: "editable"},   {id: "u1", cssClass: "closed"},{id: "n1", cssClass: "closed"},
	 {id: "d2", cssClass: "closed"}     ,{id: "f2", cssClass: "editable"},   {id: "u2", cssClass: "closed"},{id: "n2", cssClass: "closed"},
	 {id: "d3", cssClass: "closed"}     ,{id: "f3", cssClass: "editable"},   {id: "u3", cssClass: "closed"},{id: "n3", cssClass: "closed"},
	 {id: "d4", cssClass: "closed"}     ,{id: "f4", cssClass: "editable"},   {id: "u4", cssClass: "closed"},{id: "n4", cssClass: "closed"},
	 {id: "d5", cssClass: "closed"}     ,{id: "f5", cssClass: "editable"},   {id: "u5", cssClass: "closed"},{id: "n5", cssClass: "closed"},
	 {id: "d6", cssClass: "closed"}     ,{id: "f6", cssClass: "editable"},    {id: "u6", cssClass: "closed"},{id: "n6", cssClass: "closed"},

	 {id: "dMax", cssClass: "closed"}   ,{id: "fMax", cssClass: "editable"},  {id: "uMax", cssClass: "closed"},{id: "nMax", cssClass: "closed"},
	 {id: "dMin", cssClass: "closed"}   ,{id: "fMin", cssClass: "editable"},  {id: "uMin", cssClass: "closed"},{id: "nMin", cssClass: "closed"},

	 {id: "dStr", cssClass: "closed"}   ,{id: "fStr", cssClass: "editable"},  {id: "uStr", cssClass: "closed"},{id: "nStr", cssClass: "closed"},
	 {id: "dFull", cssClass: "closed"}  ,{id: "fFull", cssClass: "editable"}, {id: "uFull", cssClass: "closed"},{id: "nFull", cssClass: "closed"},
	 {id: "dPoker", cssClass: "closed"} ,{id: "fPoker", cssClass: "editable"},{id: "uPoker", cssClass: "closed"},{id: "nPoker", cssClass: "closed"},
	 {id: "dJamb", cssClass: "closed"}  ,{id: "fJamb", cssClass: "editable"}, {id: "uJamb", cssClass: "editable"},{id: "nJamb", cssClass: "closed"},
];

var FIELDS_NUM = 48;
var gStopHover = false;
var gLastCell = null;
//imgs
var IMG_SELECTORS = ["#img1", "#img2", "#img3", "#img4", "#img5", "#img6"];
var SCORE_KEY = "SCORE";

$(document).ready(function() {
	//alert("doc ready");
	// make it false to play game!
	var testingGame = false;
	setup(testingGame);
	$("#rollDice").attr('disabled', false);

	$('#newGame').on( 'click', function () {
		alert("New Game");
		FIELDS_NUM = 48;
		resetRoll(false);
		setup(false);
		calculateTotal(); // all 0
		//whatIs();
	});

	$("#rollDice").click(function(){
		if(gClickCounter == 0){
			for(var i=0; i < IMG_SELECTORS.length; i++){
				activateImage(IMG_SELECTORS[i]);
			}
		}
		gClickCounter = gClickCounter + 1;
		setInnerHtml(this);
		throwdices();
		//alert("dices=" + gDices);//global
	});

	$("#undo").click(function(){
		var undoValue = "&nbsp;";
		gLastCell.html(undoValue);
		FIELDS_NUM = FIELDS_NUM + 1;
	});


	$("img[id^='img']").click(function(){
		if(gClickCounter > 0){
			toggleImage(this);
		}
	});

$('td.taphover').on({
    mouseover: function(){
        processTabhover($(this));
    },
     mouseleave: function(){
		revertTabhover($(this));
    },
    click: function(){
        processCellClick($(this));
    }
});

	// mobile
	//$('td.taphover').on("touchstart", function (e) {
	   // 'use strict'; //satisfy code inspectors
	//    var cell = $(this); //preselect the link
	//    if (cell.hasClass('hover')) {
	//		processTabhover(cell);
	//        return true;
	//    } else {
	//        cell.addClass('hover');
	//        $('td.taphover').not(this).removeClass('hover');
	//        revertTabhover(cell);
	//        e.preventDefault();
	//        return false; //extra, and to make sure the function has consistent return points
	//    }
    //});

}); // end of document ready

function toggleImage(img){
	var src = img.src;
	var rIndex = src.indexOf("r.gif");
	var wIndex = src.indexOf("w.gif");
	if(wIndex > 0){
		src = src.replace("w.gif", "r.gif");
	}else if (rIndex > 0){
		src = src.replace("r.gif", "w.gif");
	}

	$(img).attr('src', src);
}
function setInnerHtml(btn){
	var t = btn.innerHTML;
	//alert("t=" + t);
	var n1 = t.indexOf("1");
	var n2 = t.indexOf("2");
	var n3 = t.indexOf("3");
	if(n1 > 0){
		btn.innerHTML = "Roll Dice 2";
	}
	if(n2 > 0){
		btn.innerHTML = "Roll Dice 3";
	}
	if(FIELDS_NUM == 1){ //last roll 5 times!
		var n4 = t.indexOf("4");
		var n5 = t.indexOf("5");
		if(n3 > 0){
			btn.innerHTML = "Roll Dice 4";
		}
		if(n4 > 0){
			btn.innerHTML = "Roll Dice 5";
		}
		if(n5 > 0){
			btn.innerHTML = "Roll Dice";
			btn.disabled=true;
		}
	}else{
		if(n3 > 0){
			btn.innerHTML = "Roll Dice";
			btn.disabled=true;
		}
	}
}

function revertTabhover(cell){
	var id = cell.attr("id");
    if(!gStopHover){
		var value = "";
		if(id.indexOf("Str") > 0
			|| id.indexOf("Full") > 0
			|| id.indexOf("Poker") > 0
			|| id.indexOf("Jamb") > 0
			|| id.indexOf("Max") > 0
			|| id.indexOf("Min") > 0){
				value = "&nbsp;";
		}
		cell.html(value);
	}else{
		gStopHover = false;
	}
}
function processTabhover(cell){
	var id = cell.attr("id");
	var value = cell.html().trim();
	if(isValidCell(id) && gClickCounter > 0){
		var updateScore = false;
		var editable = cell.hasClass("editable");
		if(editable || gNid == id){
			updateScore = true;
		}
		if(updateScore){
			var score = getScore(id);
			cell.html(score);
		}
	}
}

//traceList
function log(msg){
	 $("#traceList").append($("<li>").text(msg));
}

function isValidCell(cellId){
	return cellId != null && cellId != "undefined" && cellId != "";
}

function processCellClick(cell){
	//alert("processCellClick cell=" + cell);
	var id = cell.attr("id");
	var value = cell.html().trim();
	if(isValidCell(id) && gClickCounter > 0){
		var updateScore = false;
		var editable = cell.hasClass("editable");
		if(editable && gNid == ""){
			updateScore = true;
			//column
			var cellSuffix = id.substring(1);
			var n1 = id.indexOf("d");
			var n3 = id.indexOf("u");

			//if d enable next, if u enable previous
			if(n1 == 0){
				// down column
				var nextIdSuffix = getNextIdSuffix(cellSuffix);
				if(nextIdSuffix != "undefined"){
					var nextIdSelector = "#d" + nextIdSuffix;
					$(nextIdSelector).removeClass("closed").addClass("editable");
				}
			}

			if(n3 == 0){
				var preIdSuffix = getPreviousIdSuffix(cellSuffix);
				if(preIdSuffix != "undefined"){
					var preIdSelector = "#u" + preIdSuffix;
					$(preIdSelector).removeClass("closed").addClass("editable");
				}
			}
		}

		var n4 = id.indexOf("n");//najava/announcement
		if(n4 == 0){
			//alert("najava id=" + id);
			if(gClickCounter == 1){
				if(editable){
					updateScore = true;
					cell.removeClass("selectedN");
				}else{
					cell.removeClass("closed").addClass("editable selectedN");
					updateScore = false;
					gNid = id;
				}
			}else if(gClickCounter > 1 && gNid == id){
				updateScore = true;
				cell.removeClass("selectedN");
			}
		}
		if(updateScore){
			var score = getScore(id);
			if(score == 0){
				var r = confirm("Are you sure you want to write 0 here?");
				if (r == true) {
					completeThrowing(cell, score);
				} //else "You pressed Cancel!"
			}else{
				completeThrowing(cell, score);
			}
		}
	}
}

function completeThrowing(cell, score){
	cell.html(score);
	cell.removeClass('editable');
	//cell.off('mouseleave');
    //cell.off('mouseover');
    cell.off('mouseleave mouseover');
   cell.unbind('mouseenter mouseleave mouseover');
   gStopHover = true;
	resetRoll(true);
	calculateTotal();
	gLastCell = cell;
}

function getCellValue(idSel){
	var result = 0;
	var value = $(idSel).html().trim();
	if(value != "" && value != "&nbsp;"){
		result = parseInt(value);
	}
	return result;
}
function calculateTotal(){
	var numTot = updateNumColTotal();
	var sumTot = updateSumColTotal();
	var cardTot = updateCardColTotal();

	var allTot = numTot + sumTot + cardTot;
	$("#total").html(allTot);
}

function updateCardColTotal(){
	var dSum = calcCardTotal("#d");
	$("#downBigTot").html(dSum);
	var fSum = calcCardTotal("#f");
	$("#freeBigTot").html(fSum);
	var uSum = calcCardTotal("#u");
	$("#upBigTot").html(uSum);
	var nSum = calcCardTotal("#n");
	$("#nBigTot").html(nSum);

	var allTot = dSum + fSum + uSum + nSum;
	$("#bigTot").html(allTot);
	return allTot;
}

function calcCardTotal(suffixIdSel){
	var total = 0;
	var cards = ["Str", "Full", "Poker", "Jamb"];
	for (var i=0; i< cards.length; i++){
		var sel = suffixIdSel + cards[i];
		var cellVal = getCellValue(sel);
		total = total + cellVal;
	}

	return total;
}

function updateSumColTotal(){
	var dSum = calcSumTotal("#d");
	$("#downDifTot").html(dSum);
	var fSum = calcSumTotal("#f");
	$("#freeDifTot").html(fSum);
	var uSum = calcSumTotal("#u");
	$("#upDifTot").html(uSum);
	var nSum = calcSumTotal("#n");
	$("#nDifTot").html(nSum);

	var difTot = dSum + fSum + uSum + nSum;
	$("#difTot").html(difTot);
	return difTot;
}

function calcSumTotal(suffixIdSel){
	var total = 0;
	var min = getMin(suffixIdSel);
	var max = getMax(suffixIdSel);
	var sel = suffixIdSel + "1";
	var n = getCellValue(sel);
	if(max > 0 && min>0 && max > min){
		total = (max - min) * n;
	}

	return total;
}

function getMin(suffixIdSel){
	var sel = suffixIdSel + "Min";
	var cellVal = getCellValue(sel);
	return cellVal;
}

function getMax(suffixIdSel){
	var sel = suffixIdSel + "Max";
	var cellVal = getCellValue(sel);
	return cellVal;
}

function updateNumColTotal(){
	var dNum = calcColNumTotal("#d");
	$("#downTot").html(dNum);
	var fNum = calcColNumTotal("#f");
	$("#freeTot").html(fNum);
	var uNum = calcColNumTotal("#u");
	$("#upTot").html(uNum);
	var nNum = calcColNumTotal("#n");
	$("#nTot").html(nNum);

	var digTot = dNum + fNum + uNum + nNum;
	$("#digTot").html(digTot);
	return digTot;
}

function calcColNumTotal(suffixIdSel){
	var total = 0;//getCellValue("#d1");
	for (var i=0; i< 6; i++){
		var sel = suffixIdSel + (i+1);
		var cellVal = getCellValue(sel);
		total = total + cellVal;
	}
	if(total >= 60){
		total = total + 30;
	}

	return total;
}



function getNextIdSuffix(suffix){
	for (var i=0; i< IDS_SUFFIXES.length; i++){
		if(i != IDS_SUFFIXES.length && IDS_SUFFIXES[i] == suffix){
			return IDS_SUFFIXES[i + 1];
		}
	}
	return "undefined";
}

function getPreviousIdSuffix(suffix){
	for (var i=0; i< IDS_SUFFIXES.length; i++){
		if(i != 0 && IDS_SUFFIXES[i] == suffix){
			return IDS_SUFFIXES[i - 1];
		}
	}
	return "undefined";
}

function resetRoll(decrement){

	if(FIELDS_NUM > 1){
		if(decrement){
			FIELDS_NUM = FIELDS_NUM - 1;
		}
		gClickCounter = 0;
		gNid = "";
		$("#rollDice").attr('disabled', false).text("Roll Dice 1");
	}else{
		FIELDS_NUM = 48;
		$("#rollDice").attr('disabled', true).text("Game Over!");
		var score = $("#total").html();
		var storedScore = retrieveFinalScore();
		if(parseInt(score) > parseInt(storedScore)){
			$("#my_total").html(score);
			storeFinalScore(score);
		}
	}

	for (var i=0; i< IMG_SELECTORS.length; i++){
		resetImage(IMG_SELECTORS[i]);
	}
}

//to calculate score use only 5 red
function validDicesFun(){
	var validDaces = [];
	var j = 0;
	for (var i=0; i< gDices.length; i++){
		if(isRed(i)){
			log("gDices[" + i +"]=" + gDices[i]);
			validDaces[j] = parseInt(gDices[i]);
			j++;
		}
	}
	return validDaces;
}

function isRed(diceNum){
	var idSel = IMG_SELECTORS[diceNum];//"#img" + diceNum;
	var src = $(idSel).attr('src');
	var rIndex = src.indexOf("r.gif");
	return rIndex > 0;
}

function getScore(cellId){
	// cell is editable!
	//is valid cell to write the score
	var score = 0;
	var validDaces = validDicesFun();
	var counters = what(validDaces);
	for (var i=0; i< counters.length; i++){
		if(counters[i] != 0){
			// if number
			var rowName = cellId.substring(1);
			if(isNumber(rowName)){
				if(validDaces.length <= 5){
					if((i + 1) == rowName){
						score = counters[i] * rowName;
					}
				}else{
					alert("Please select 5 dices");
				}
			}else{
				// if i=6 =>S
				if(i == 6 && rowName == "Max"){
					if(validDaces.length == 5){
						score = diceSum(validDaces);
					}else{
						alert("Please select 5 dices");
					}
				}else if(i == 7 && rowName == "Min"){
					if(validDaces.length == 5){
						score = diceSum(validDaces);
					}else{
						alert("Please select 5 dices");
					}
				}else if(i == 8 && rowName == "Str"){
					if(validDaces.length == 5){
						score = diceSum(validDaces) + 20;
					}else{
						alert("Please select 5 dices");
					}
				}else if(i == 9 && rowName == "Full"){
					if(validDaces.length == 5){
						score = diceSum(validDaces) + 30;
					}else{
						alert("Please select 5 dices");
					}
				}else if(i == 10 && rowName == "Poker"){
					if(validDaces.length == 4){
						score = diceSum(validDaces) + 40;
					}else{
						alert("Please select 5 dices");
					}
				}else if(i == 11 && rowName == "Jamb"){
					if(validDaces.length == 5){
						score = diceSum(validDaces) + 50;
					}else{
						alert("Please select 5 dices");
					}
				}
			}
		}
	}
	return score;
}

function diceSum(validDaces){
	var sum = 0;
	for (var i=0; i< validDaces.length; i++){
		sum = sum + validDaces[i];
	}
	return sum;
}

function isNumber(n) {
	return !isNaN(parseInt(n)) && isFinite(n);
}

// only for testing last 3 rolls
function getValidValue(field) {
	var value = 0;
	if(field.id.indexOf("Str") > 0){
		value = 40;
	}else if(field.id.indexOf("Full") > 0){
		value = 58;
	}else if(field.id.indexOf("Poker") > 0){
		value = 64;
	}else if(field.id.indexOf("Jamb") > 0){
		value = 70;
	}else if(field.id.indexOf("Max") > 0){
		value = 0;
	}else if(field.id.indexOf("Min") > 0){
		value = 0;
	}else if(field.id.indexOf("1") > 0){
		value = 5;
	}else if(field.id.indexOf("2") > 0){
		value = 10;
	}else if(field.id.indexOf("3") > 0){
		value = 15;
	}else if(field.id.indexOf("4") > 0){
		value = 20;
	}else if(field.id.indexOf("5") > 0){
		value = 25;
	}else if(field.id.indexOf("6") > 0){
		value = 30;
	}

	return value;
}

function setup(bTestEnd){
	if(bTestEnd){
		FIELDS_NUM = 3; // only 3 moves left
	}else{
		// reset score to 0
		//var score = 0;
		//$("#my_total").html(score);
		//storeFinalScore(score);
	}
	for (var i=0; i< START_BOARD.length; i++){
		var field = START_BOARD[i];
		var value = "";
		if(bTestEnd && i < 45){
			value = getValidValue(field);
		}else{
			if("dStr" == field.id
				|| "dFull" == field.id
				|| "dPoker" == field.id
				|| "dJamb" == field.id
				|| "dMax" == field.id
				|| "dMin" == field.id){
					value = "&nbsp;";
			}
		}
		var idCell = "#" + field.id;
		var cell = $(idCell);
		if(!cell.hasClass(field.cssClass)){
			cell.addClass(field.cssClass).html(value);
		}else{
			cell.html(value);
		}
	}
}

function getCurrentDiceNum(iSrcString) {
	log("iSrcString=" + iSrcString);
	var dotIndex = iSrcString.indexOf(".gif");
	log("dotIndex=" + dotIndex);
	var currentDice = iSrcString.substring(dotIndex-2, dotIndex-1);
	log("currentDice=" + currentDice);
	log("end getCurrentDiceNum(iSrcString)");
	return currentDice;
}

function throwdices() {

	for(var i=0; i < IMG_SELECTORS.length; i++){
		var idSel = IMG_SELECTORS[i];
		var image = $(idSel);
		var attrSrc = image.attr('src');
		var wIndex = attrSrc.indexOf("w.gif");
		gDices[i] = getCurrentDiceNum(attrSrc);
		if(wIndex > 0){
			var d = throwdice();//1 to 6
			gDices[i]=d;//new value
			var sub = attrSrc.substring(0, wIndex - 1);
			var newSrc = sub + d + "w.gif"
		 	image.attr('src', newSrc);
		}
	}
}

//unit tests
function whatIs() {
	var rolls = [
		[1,1,1,2,2],
		[1,1,2,2,2],
		[2,2,2,2,2],
		[1,2,2,2,2],
		[1,3,1,4,2],
		[6,6,1,2,2],
		[1,5,3,2,4]
	];

	for (var i=0; i< rolls.length; i++){
		var counters=what(rolls[i]);
		alert(counters);
	}
}

function count(roll) {
		var counters = [0,0,0,0,0,0, 0,0, 0,0,0,0];//first 6 numbers, Max/Min and after that S,F,P,J
		for (var i=0; i< roll.length; i++){
			switch (roll[i]) {
				case 1:
					counters[0]=counters[0]+1;
					break;
				case 2:
					counters[1]=counters[1]+1;
					break;
				case 3:
					counters[2]=counters[2]+1;
					break;
				case 4:
					counters[3]=counters[3]+1;
					break;
				case 5:
					counters[4]=counters[4]+1;
					break;
				case 6:
					counters[5]=counters[5]+1;
					break;
			}
		}

	return counters;
}
function what(roll) {
	//var roll = [1,1,1,2,2]; could be any number of dices
	var counters = count(roll);
	//alert("c1=" + c1 + ";c2=" + c2 + ";c3=" + c3 + ";c4=" + c4 + ";c5=" + c5 + ";c6=" + c6);
	if(roll.length == 5){
		counters[6]=1; //Max
		counters[7]=1; //Min
	}

	if(roll.length == 5 && isStraight(counters)){
		counters[8]=1;
	}
	if(roll.length == 5 && isFull(counters)){
		counters[9]=1;
	}
	if(roll.length == 4 && isPoker(counters)){
		counters[10]=1;
	}
	if(roll.length == 5 && isJamb(counters)){
		counters[11]=1;
	}

	return counters;
}

function isStraight(counters, rollLength) {
	//only first 6 elements
	return (counters[0] >= 1 && counters[1] >= 1 && counters[2] >= 1 && counters[3] >= 1 && counters[4] >= 1)
		|| (counters[1] >= 1 && counters[2] >= 1 && counters[3] >= 1 && counters[4] >= 1 && counters[5] >= 1)
}

function isJamb(counters) {
	return hasSame(counters, 5);
}

function isPoker(counters) {
	return hasSame(counters, 4);
}

function isFull(counters) {
	return hasSame(counters, 2) && hasSame(counters, 3);
}

function hasSame(counters, numOfSame) {
	for (var i=0; i< counters.length; i++){
		if(counters[i] == numOfSame){
			return true;
		}
	}
	return false;
}

function throwdice() {
	var ch = 1 + Math.floor(Math.random()*6);
	return ch;
}

function resetImage(selId){
	var src = $(selId).attr('src');
	var rIndex = src.indexOf("r.gif");
	var wIndex = src.indexOf("w.gif");
	if(wIndex > 0){
		src = src.replace("w.gif", "g.gif");
	}else if (rIndex > 0){
		src = src.replace("r.gif", "g.gif");
	}

	$(selId).attr('src', src);
}

function activateImage(selId){
	replaceImage(selId, "g.gif", "w.gif");
}

function replaceImage(selId, oldGif, newGif){
	var oldSrc = $(selId).attr('src');
	var src = oldSrc.replace(oldGif, newGif);
	$(selId).attr('src', src);
}

function deleteFinalScore(){
	$.jStorage.deleteKey(SCORE_KEY);
}

var G_KEEP_REMARKS = 10*60*60*1000; //The requirement is to keep remarks for 10 hours.
function storeFinalScore(value){
	$.jStorage.set(SCORE_KEY, value);
	//$.jStorage.setTTL(key, G_KEEP_REMARKS); // expires in [ms].
}

function retrieveFinalScore(){
	var existing = $.jStorage.get(SCORE_KEY);
	if(existing == null){
		existing = "0";
	}
	return existing;
}
