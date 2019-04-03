/* test_scrin.js */

ui.debug.addDebugData('scrin', {
	url : '6/6/i2s63s.i', // multiple solutions
	failcheck : [
		['bkNumNoRoom', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
		['bkNumNoRoom', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /0 0 0 0 0 0 0 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 1 1 0 0 /0 0 1 1 0 0 /1 0 0 0 1 1 /0 0 0 0 0 0 /1 0 0 0 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /"], // placeholder clue
		//['bdDeadEnd', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 0 0 0 0 /1 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"], // on the edge
		['bdDeadEnd', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 0 0 0 0 /0 1 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"], // inside
		['bdBranch', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 0 0 0 0 /0 0 1 1 0 0 0 /0 0 1 1 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
		//['bdBranch', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /1 1 0 0 0 0 0 /1 0 0 0 0 0 0 /1 1 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
		['bkNumGe2', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 1 0 0 1 /0 0 0 1 0 0 1 /0 0 0 1 0 0 1 /1 0 0 1 0 0 0 /1 0 0 1 0 0 0 /1 0 0 1 0 0 0 /0 0 0 1 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 1 1 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 1 0 0 0 /"],
		['bkSizeNe', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /0 0 0 0 0 0 0 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /0 0 0 0 0 0 0 /0 0 1 1 0 0 0 /0 0 1 1 0 0 /0 0 1 1 0 0 /1 0 0 0 1 1 /0 0 0 0 0 0 /1 0 0 0 1 1 /0 0 1 0 0 0 /0 0 1 0 0 0 /"],
		['bkNotRect', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /0 0 0 0 0 0 0 /1 0 1 0 1 0 1 /1 1 0 0 1 0 1 /0 0 0 0 1 1 0 /0 0 1 1 1 1 0 /0 0 1 1 0 0 /0 0 1 1 0 0 /1 1 0 0 1 1 /0 1 0 0 0 0 /1 0 0 0 0 1 /0 0 1 0 0 0 /0 0 1 0 1 0 /"],
		['rmIsolated', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /0 0 0 0 0 0 0 /0 0 1 0 1 0 0 /0 0 1 1 0 0 /1 0 1 1 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 0 0 0 1 1 /0 0 1 1 0 0 /0 0 1 1 0 0 /"],
		['rmDeadEnd', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /0 1 1 0 0 0 0 /0 0 1 0 1 0 0 /0 0 1 1 0 0 /1 0 1 1 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 0 0 1 1 /0 1 1 1 0 0 /0 0 1 1 0 0 /"],
		['rmBranch',  "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /1 1 1 0 1 0 0 /0 1 1 0 1 0 1 /1 1 0 0 1 0 1 /1 1 0 0 1 0 1 /1 1 0 1 1 0 0 /0 1 0 1 0 0 0 /1 0 1 1 0 0 /1 1 1 1 1 1 /1 1 0 0 0 0 /0 0 0 0 0 0 /0 0 0 1 1 1 /1 1 1 1 0 0 /0 1 1 0 0 0 /"],
		['rmCross', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /1 1 1 0 1 0 0 /0 1 1 0 1 0 1 /1 1 1 1 1 0 1 /1 1 0 0 1 0 1 /1 1 0 1 1 0 0 /0 1 0 1 0 0 0 /1 0 1 1 0 0 /1 1 1 1 1 1 /1 1 1 0 0 0 /0 0 1 0 0 0 /0 0 0 1 1 1 /1 1 1 1 0 0 /0 1 1 0 0 0 /"],
		//['middle', "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 1 0 1 0 0 /0 1 1 0 1 0 1 /1 1 1 1 1 0 1 /1 1 1 1 1 0 1 /1 1 0 1 1 0 0 /0 1 0 1 0 0 0 /0 0 1 1 0 0 /0 1 1 1 1 1 /1 1 1 0 0 0 /0 0 0 0 0 0 /0 0 1 1 1 1 /1 1 1 1 0 0 /0 1 1 0 0 0 /"],
		//['lnPlLoop', ""],
		[null,        "pzprv3/scrin/6/6/. . . 2 . . /. . . . . . /. . . . . 6 /3 . . . . . /. . . . . . /. . - . . . /0 0 0 1 1 0 0 /0 1 1 1 1 0 0 /1 1 1 1 1 -1 1 /1 1 0 0 1 -1 1 /1 1 0 0 1 0 1 /0 1 0 0 1 0 0 /0 0 0 1 0 0 /0 1 0 0 0 0 /1 1 1 1 1 1 /-1 0 1 0 -1 -1 /0 0 0 0 0 0 /1 1 1 1 1 1 /0 1 1 1 0 0 /"]
	],
	inputs : []
});