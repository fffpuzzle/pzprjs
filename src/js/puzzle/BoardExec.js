// BoardExec.js v3.4.1

(function(){

// 拡大縮小・回転反転用定数
var UP = 0x01,
	DN = 0x02,
	LT = 0x03,
	RT = 0x04,

	EXPAND = 0x10,
	REDUCE = 0x20,
	TURN   = 0x40,
	FLIP   = 0x80;

pzpr.classmgr.makeCommon({
//---------------------------------------------------------------------------
// ★BoardExecクラス 盤面の拡大縮小、反転回転等を行う (MenuExec.js, Board.jsから移動)
//---------------------------------------------------------------------------
BoardExec:{
	// 拡大縮小・回転反転用定数
	UP : UP,
	DN : DN,
	LT : LT,
	RT : RT,

	EXPAND : EXPAND,
	REDUCE : REDUCE,
	TURN   : TURN,
	FLIP   : FLIP,
	TURNFLIP: (TURN|FLIP),

	EXPANDUP: (EXPAND|UP),
	EXPANDDN: (EXPAND|DN),
	EXPANDLT: (EXPAND|LT),
	EXPANDRT: (EXPAND|RT),

	REDUCEUP: (REDUCE|UP),
	REDUCEDN: (REDUCE|DN),
	REDUCELT: (REDUCE|LT),
	REDUCERT: (REDUCE|RT),

	TURNL: (TURN|1),
	TURNR: (TURN|2),

	FLIPX: (FLIP|1),
	FLIPY: (FLIP|2),

	boardtype : {
		expandup: [REDUCE|UP, EXPAND|UP],
		expanddn: [REDUCE|DN, EXPAND|DN],
		expandlt: [REDUCE|LT, EXPAND|LT],
		expandrt: [REDUCE|RT, EXPAND|RT],
		reduceup: [EXPAND|UP, REDUCE|UP],
		reducedn: [EXPAND|DN, REDUCE|DN],
		reducelt: [EXPAND|LT, REDUCE|LT],
		reducert: [EXPAND|RT, REDUCE|RT],
		turnl: [TURN|2, TURN|1],
		turnr: [TURN|1, TURN|2],
		flipy: [FLIP|2, FLIP|2],
		flipx: [FLIP|1, FLIP|1]
	},

	// expand/reduce処理用
	qnumw : [],	// ques==51の回転･反転用
	qnumh : [],	// ques==51の回転･反転用

	// expand/reduce処理で消える/増えるオブジェクトの判定用
	insex : {
		cell   : {1:true},
		cross  : {},	/* Board初期化時に設定します */
		border : {1:true, 2:true},
		excell : {1:true}
	},

	//------------------------------------------------------------------------------
	// bd.exec.execadjust()   盤面の調整、回転、反転で対応する関数へジャンプする
	//------------------------------------------------------------------------------
	execadjust : function(name){
		var o = this.owner, bd = o.board;
		if(name.indexOf("reduce")===0){
			if(name==="reduceup"||name==="reducedn"){
				if(bd.qrows<=1){ return;}
			}
			else if(name==="reducelt"||name==="reducert"){
				if(bd.qcols<=1){ return;}
			}
		}

		o.opemgr.newOperation();

		o.painter.suspendAll();

		// undo/redo時はexpandreduce・turnflipを直接呼びます
		var d = {x1:0, y1:0, x2:2*bd.qcols, y2:2*bd.qrows}; // 範囲が必要なのturnflipだけかも..
		var key = this.boardtype[name][1];
		if(key & this.TURNFLIP){ this.turnflip(key,d);}
		else                   { this.expandreduce(key,d);}
		this.addOpe(d, name);

		bd.setminmax();
		bd.resetInfo();

		// Canvasを更新する
		o.adjustCanvasSize();
		o.painter.unsuspend();
	},


	//------------------------------------------------------------------------------
	// bd.exec.addOpe() 指定された盤面(拡大・縮小, 回転・反転)操作を追加する
	//------------------------------------------------------------------------------
	addOpe : function(d, name){
		var key = this.boardtype[name][1], puzzle = this.owner, ope;
		if(key & this.TURNFLIP){ ope = new puzzle.BoardFlipOperation(d, name);}
		else                   { ope = new puzzle.BoardAdjustOperation(name);}
		puzzle.opemgr.add(ope);
	},

	//------------------------------------------------------------------------------
	// bd.exec.expandreduce() 盤面の拡大・縮小を実行する
	// bd.exec.expandGroup()  オブジェクトの追加を行う
	// bd.exec.reduceGroup()  オブジェクトの消去を行う
	// bd.exec.isdel()        消去されるオブジェクトかどうか判定する
	//------------------------------------------------------------------------------
	expandreduce : function(key,d){
		var bd = this.owner.board;
		bd.disableInfo();
		this.adjustBoardData(key,d);
		if(bd.rooms.hastop && (key & this.REDUCE)){ this.reduceRoomNumber(key,d);}

		if(key & this.EXPAND){
			if     (key===this.EXPANDUP||key===this.EXPANDDN){ bd.qrows++;}
			else if(key===this.EXPANDLT||key===this.EXPANDRT){ bd.qcols++;}

			this.expandGroup('cell',   key);
			this.expandGroup('cross',  key);
			this.expandGroup('border', key);
			this.expandGroup('excell', key);
		}
		else if(key & this.REDUCE){
			this.reduceGroup('cell',   key);
			this.reduceGroup('cross',  key);
			this.reduceGroup('border', key);
			this.reduceGroup('excell', key);

			if     (key===this.REDUCEUP||key===this.REDUCEDN){ bd.qrows--;}
			else if(key===this.REDUCELT||key===this.REDUCERT){ bd.qcols--;}
		}
		bd.setposAll();

		this.adjustBoardData2(key,d);
		bd.enableInfo();
	},
	expandGroup : function(type,key){
		var bd = this.owner.board;
		var margin = bd.initGroup(type, bd.qcols, bd.qrows);
		var group = bd.getGroup(type);
		var group2 = new group.constructor();
		bd.setposGroup(type);
		for(var i=group.length-1;i>=0;i--){
			var obj = group[i];
			if(this.isdel(key,obj)){
				obj = bd.newObject(type, i);
				group[i] = obj;
				group2.add(obj);
				margin--;
			}
			else if(margin>0){ group[i] = group[i-margin];}
		}
		group2.allclear(false);

		if(type==='border'){ this.expandborder(key);}
	},
	reduceGroup : function(type,key){
		var bd = this.owner.board;
		if(type==='border'){ this.reduceborder(key);}

		var margin=0, group = bd.getGroup(type), group2 = new group.constructor();
		for(var i=0;i<group.length;i++){
			var obj = group[i];
			if(this.isdel(key,obj)){
				obj.id = i;
				group2.add(obj);
				margin++;
			}
			else if(margin>0){ group[i-margin] = group[i];}
		}
		var opemgr = this.owner.opemgr;
		if(!opemgr.undoExec && !opemgr.redoExec){
			opemgr.forceRecord = true;
			group2.allclear(true);
			opemgr.forceRecord = false;
		}
		for(var i=0;i<margin;i++){ group.pop();}
	},
	isdel : function(key,obj){
		return !!this.insex[obj.group][this.distObj(key,obj)];
	},

	//------------------------------------------------------------------------------
	// bd.exec.turnflip()      回転・反転処理を実行する
	// bd.exec.turnflipGroup() turnflip()から内部的に呼ばれる回転実行部
	//------------------------------------------------------------------------------
	turnflip : function(key,d){
		var bd = this.owner.board;
		bd.disableInfo();
		this.adjustBoardData(key,d);

		if(key & this.TURN){
			var tmp = bd.qcols; bd.qcols = bd.qrows; bd.qrows = tmp;
			bd.setposAll();
			d = {x1:0, y1:0, x2:2*bd.qcols, y2:2*bd.qrows};
		}

		this.turnflipGroup('cell',   key, d);
		this.turnflipGroup('cross',  key, d);
		this.turnflipGroup('border', key, d);
		this.turnflipGroup('excell', key, d);

		bd.setposAll();

		this.adjustBoardData2(key,d);
		bd.enableInfo();
	},
	turnflipGroup : function(type,key,d){
		var bd = this.owner.board;
		if(type==='excell' && bd.hasexcell===1 && (key & this.FLIP)){
			var d2 = {x1:d.x1, y1:d.y1, x2:d.x2, y2:d.y2};
			if     (key===this.FLIPY){ d2.x1 = d2.x2 = -1;}
			else if(key===this.FLIPX){ d2.y1 = d2.y2 = -1;}
			d = d2;
		}

		var ch=[], objlist=bd.objectinside(type,d.x1,d.y1,d.x2,d.y2);
		for(var i=0;i<objlist.length;i++){ ch[objlist[i].id]=false;}

		var group = bd.getGroup(type);
		var xx=(d.x1+d.x2), yy=(d.y1+d.y2);
		for(var source=0;source<group.length;source++){
			if(ch[source]!==false){ continue;}

			var tmp = group[source], target = source, next;
			while(ch[target]===false){
				ch[target]=true;
				// nextになるものがtargetに移動してくる、、という考えかた。
				// ここでは移動前のIDを取得しています
				switch(key){
					case this.FLIPY: next = bd.getObjectPos(type, group[target].bx, yy-group[target].by).id; break;
					case this.FLIPX: next = bd.getObjectPos(type, xx-group[target].bx, group[target].by).id; break;
					case this.TURNR: next = bd.getObjectPos(type, group[target].by, xx-group[target].bx, bd.qrows, bd.qcols).id; break;
					case this.TURNL: next = bd.getObjectPos(type, yy-group[target].by, group[target].bx, bd.qrows, bd.qcols).id; break;
				}

				if(ch[next]===false){
					group[target] = group[next];
					target = next;
				}
				else{
					group[target] = tmp;
					break;
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.exec.distObj()      上下左右いずれかの外枠との距離を求める
	//---------------------------------------------------------------------------
	distObj : function(key,obj){
		var bd = this.owner.board;
		if(obj.isnull){ return -1;}

		key &= 0x0F;
		if     (key===this.UP){ return obj.by;}
		else if(key===this.DN){ return 2*bd.qrows-obj.by;}
		else if(key===this.LT){ return obj.bx;}
		else if(key===this.RT){ return 2*bd.qcols-obj.bx;}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.exec.expandborder() 盤面の拡大時、境界線を伸ばす
	// bd.exec.reduceborder() 盤面の縮小時、線を移動する
	//---------------------------------------------------------------------------
	expandborder : function(key){
		var bd = this.owner.board;
		// borderAsLineじゃないUndo時は、後でオブジェクトを代入するので下の処理はパス
		if(bd.lines.borderAsLine || !bd.owner.opemgr.undoExec){
			var group2 = new this.owner.BorderList();
			// 直前のexpandGroupで、bx,byプロパティが不定なままなので設定する
			bd.setposBorders();

			var dist = (bd.lines.borderAsLine?2:1);
			for(var id=0;id<bd.bdmax;id++){
				var border = bd.border[id];
				if(this.distObj(key,border)!==dist){ continue;}

				var source = (bd.lines.borderAsLine ? this.outerBorder(id,key) : this.innerBorder(id,key));
				this.copyBorder(border, source);
				group2.add(source);
			}
			if(bd.lines.borderAsLine){ group2.allclear(false);}
		}
	},
	reduceborder : function(key){
		var bd = this.owner.board;
		if(bd.lines.borderAsLine){
			for(var id=0;id<bd.bdmax;id++){
				var border = bd.border[id];
				if(this.distObj(key,border)!==0){ continue;}

				var source = this.innerBorder(id,key);
				this.copyBorder(border, source);
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.exec.copyBorder()   (expand/reduceBorder用) 指定したデータをコピーする
	// bd.exec.innerBorder()  (expand/reduceBorder用) ひとつ内側に入ったborderのidを返す
	// bd.exec.outerBorder()  (expand/reduceBorder用) ひとつ外側に行ったborderのidを返す
	//---------------------------------------------------------------------------
	copyBorder : function(border1,border2){
		border1.ques  = border2.ques;
		border1.qans  = border2.qans;
		if(this.owner.board.lines.borderAsLine){
			border1.line  = border2.line;
			border1.qsub  = border2.qsub;
			border1.color = border2.color;
		}
	},
	innerBorder : function(id,key){
		var border=this.owner.board.border[id];
		key &= 0x0F;
		if     (key===this.UP){ return border.relbd(0, 2);}
		else if(key===this.DN){ return border.relbd(0,-2);}
		else if(key===this.LT){ return border.relbd(2, 0);}
		else if(key===this.RT){ return border.relbd(-2,0);}
		return null;
	},
	outerBorder : function(id,key){
		var border=this.owner.board.border[id];
		key &= 0x0F;
		if     (key===this.UP){ return border.relbd(0,-2);}
		else if(key===this.DN){ return border.relbd(0, 2);}
		else if(key===this.LT){ return border.relbd(-2,0);}
		else if(key===this.RT){ return border.relbd( 2,0);}
		return null;
	},

	//---------------------------------------------------------------------------
	// bd.exec.reduceRoomNumber()   盤面縮小時に数字つき部屋の処理を行う
	//---------------------------------------------------------------------------
	reduceRoomNumber : function(key,d){
		var qnums = [];
		var bd = this.owner.board;
		for(var c=0;c<bd.cell.length;c++){
			var cell = bd.cell[c];
			if(!!this.insex.cell[this.distObj(key,cell)]){
				if(cell.qnum!==-1){
					qnums.push({cell:cell, areaid:bd.rooms.getRoomID(cell), pos:[cell.bx,cell.by], val:cell.qnum});
					cell.qnum=-1;
				}
				bd.rooms.removeCell(cell);
			}
		}
		for(var i=0;i<qnums.length;i++){
			var data = qnums[i], areaid = data.areaid;
			var top = bd.rooms.calcTopOfRoom(areaid);
			if(top===null){
				var opemgr = this.owner.opemgr;
				if(!opemgr.undoExec && !opemgr.redoExec){
					opemgr.forceRecord = true;
					data.cell.addOpe('qnum', data.val, -1);
					opemgr.forceRecord = false;
				}
			}
			else{
				bd.cell[top].qnum = data.val;
			}
		}
	},

	//------------------------------------------------------------------------------
	// bd.exec.adjustBoardData()    回転・反転開始前に各セルの調節を行う(共通処理)
	// bd.exec.adjustBoardData2()   回転・反転終了後に各セルの調節を行う(共通処理)
	//------------------------------------------------------------------------------
	adjustBoardData  : function(key,d){ },
	adjustBoardData2 : function(key,d){ }
}
});

})();