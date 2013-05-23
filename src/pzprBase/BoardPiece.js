// BoardPiece.js v3.4.0
(function(){

var k = pzprv3.consts;

//---------------------------------------------------------------------------
// ��BoardPiece�N���X Cell, Cross, Border, EXCell�N���X�̃x�[�X
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('BoardPiece',
{
	bx : -1,	// X���W(border���W�n)��ێ�����
	by : -1,	// Y���W(border���W�n)��ێ�����

	group : 'none',
	isnull : true,

	iscellobj   : false,
	iscrossobj  : false,
	isborderobj : false,
	isexcellobj : false,

	id : null,
	error: 0,

	propall : [],
	propans : [],
	propsub : [],

	// ���͂ł���ő�E�ŏ��̐���
	maxnum : 255,
	minnum : 1,

	//---------------------------------------------------------------------------
	// getaddr() �����̔Ֆʒ��ł̈ʒu��Ԃ�
	// relcell(), relcross(), relbd(), relexcell() ���Έʒu�ɑ��݂���I�u�W�F�N�g��Ԃ�
	//---------------------------------------------------------------------------
	getaddr : function(){ return this.owner.newInstance('Address',[this.bx, this.by]);},

	relcell   : function(dx,dy){ return this.owner.board.getc(this.bx+dx,this.by+dy);},
	relcross  : function(dx,dy){ return this.owner.board.getx(this.bx+dx,this.by+dy);},
	relbd     : function(dx,dy){ return this.owner.board.getb(this.bx+dx,this.by+dy);},
	relexcell : function(dx,dy){ return this.owner.board.getex(this.bx+dx,this.by+dy);},
	
	//---------------------------------------------------------------------------
	// ub() db() lb() rb()  �Z�����_�̏㉺���E�ɂ��鋫�E����ID��Ԃ�
	//---------------------------------------------------------------------------
	ub : function(){ return this.owner.board.getb(this.bx,this.by-1);},
	db : function(){ return this.owner.board.getb(this.bx,this.by+1);},
	lb : function(){ return this.owner.board.getb(this.bx-1,this.by);},
	rb : function(){ return this.owner.board.getb(this.bx+1,this.by);},

	//---------------------------------------------------------------------------
	// setdata() Cell,Cross,Border,EXCell�̒l��ݒ肷��
	//---------------------------------------------------------------------------
	setdata : function(prop, num){
		if(!!this.prehook[prop]){ if(this.prehook[prop].call(this,num)){ return;}}

		this.owner.opemgr.addOpe_Object(this, prop, this[prop], num);
		this[prop] = num;

		if(!!this.posthook[prop]){ this.posthook[prop].call(this,num);}
	},
	
	//---------------------------------------------------------------------------
	// nummaxfunc() ���͂ł��鐔���̍ő�l��Ԃ�
	// numminfunc() ���͂ł��鐔���̍ŏ��l��Ԃ�
	//---------------------------------------------------------------------------
	nummaxfunc : function(){ return this.maxnum;},
	numminfunc : function(){ return this.minnum;},

	//---------------------------------------------------------------------------
	// prehook  �l�̐ݒ�O�ɂ���Ă���������A�ݒ�֎~�������s��
	// posthook �l�̐ݒ��ɂ���Ă����������s��
	//---------------------------------------------------------------------------
	prehook  : {},
	posthook : {},

	//---------------------------------------------------------------------------
	// draw()   �ՖʂɎ����̎��͂�`�悷��
	//---------------------------------------------------------------------------
	draw : function(){
		this.owner.painter.paintRange(this.bx-1, this.by-1, this.bx+1, this.by+1);
	},

	//---------------------------------------------------------------------------
	// seterr() error�l��ݒ肷��
	//---------------------------------------------------------------------------
	seterr : function(num){
		if(this.owner.board.isenableSetError()){ this.error = num;}
	},

	//---------------------------------------------------------------------------
	// allclear() �ʒu,�`����ȊO���N���A����
	// ansclear() qans,anum,line,qsub,error�����N���A����
	// subclear() qsub,error�����N���A����
	// comclear() 3�̋��ʏ���
	//---------------------------------------------------------------------------
	allclear : function(isrec) { /* undo,redo�ȊO�ŔՖʏk��������Ƃ���, isrec===true */
		this.comclear(this.propall, isrec);
		if(this.color!==(void 0)){ this.color = "";}
		this.error = 0;
	},
	ansclear : function(){
		this.comclear(this.propans, true);
		if(this.color!==(void 0)){ this.color = "";}
		this.error = 0;
	},
	subclear : function(){
		this.comclear(this.propsub, true);
		this.error = 0;
	},

	comclear : function(props, isrec){
		for(var i=0;i<props.length;i++){
			var def = this.constructor.prototype[props[i]];
			if(this[props[i]]!==def){
				if(isrec){ this.owner.opemgr.addOpe_Object(this, props[i], this[props[i]], def);}
				this[props[i]] = def;
			}
		}
	}
});

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
pzprv3.createPuzzleClass('Cell:BoardPiece',
{
	group : 'cell',

	iscellobj : true,

	// �f�t�H���g�l
	ques : 0,	// �Z���̖��f�[�^��ێ�����(1:���}�X 2-5:�O�p�` 6:�A�C�X 7:�ՖʊO 11-17:�\���^ 21-22:���� 51:�J�b�N��)
	qans : 0,	// �Z���̉񓚃f�[�^��ێ�����(1:���}�X/������ 2-5:�O�p�` 11-13:�_ 31-32:�ΐ� 41-50:�ӂƂ�)
	qdir : 0,	// �Z���̖��f�[�^��ێ�����(�����ɂ����/�J�b�N���̉���)
	qnum :-1,	// �Z���̖��f�[�^��ێ�����(����/������/�P�̖��/���ۍ���/�J�b�N���̉E��)
	anum :-1,	// �Z���̉񓚃f�[�^��ێ�����(����/������/�P�̖��)
	qsub : 0,	// �Z���̕⏕�f�[�^��ێ�����(1:���}�X 1-2:�w�i�F/���~ 3:�G�ɂȂ镔��)
	color: "",	// �F�����f�[�^��ێ�����

	base : null,	// �ې�����A���t�@�x�b�g���ړ����Ă����ꍇ�̈ړ����̃Z�������� (�ړ��Ȃ����͎������g���w��)

	propall : ['ques', 'qans', 'qdir', 'qnum', 'anum', 'qsub'],
	propans : ['qans', 'anum', 'qsub'],
	propsub : ['qsub'],
	
	disInputHatena : false,	// qnum==-2����͂ł��Ȃ��悤�ɂ���
	
	numberWithMB   : false,	// �񓚂̐����Ɓ��~������p�Y��(���͐����������Ă��鈵�������)
	numberAsObject : false,	// �����ȊO��qnum/anum���g�p����(�����l����͂ŏ����ł�����A�񓚂ŁE�����͂ł���)
	
	numberIsWhite  : false,	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	
	//---------------------------------------------------------------------------
	// cell.up() dn() lt() rt()  �Z���̏㉺���E�ɐڂ���Z����ID��Ԃ�
	//---------------------------------------------------------------------------
	up : function(){ return this.owner.board.getc(this.bx,this.by-2);},
	dn : function(){ return this.owner.board.getc(this.bx,this.by+2);},
	lt : function(){ return this.owner.board.getc(this.bx-2,this.by);},
	rt : function(){ return this.owner.board.getc(this.bx+2,this.by);},

	//---------------------------------------------------------------------------
	// �I�u�W�F�N�g�ݒ�l��getter/setter
	//---------------------------------------------------------------------------
	getQues : function(){ return this.ques;},
	setQues : function(val){ this.setdata(k.QUES, val);},

	getQans : function(){ return this.qans;},
	setQans : function(val){ this.setdata(k.QANS, val);},

	getQdir : function(){ return this.qdir;},
	setQdir : function(val){ this.setdata(k.QDIR, val);},

	getQnum : function(){ return this.qnum;},
	setQnum : function(val){ this.setdata(k.QNUM, val);},

	getAnum : function(){ return this.anum;},
	setAnum : function(val){ this.setdata(k.ANUM, val);},

	getQsub : function(){ return this.qsub;},
	setQsub : function(val){ this.setdata(k.QSUB, val);},

	//---------------------------------------------------------------------------
	// prehook  �l�̐ݒ�O�ɂ���Ă���������A�ݒ�֎~�������s��
	// posthook �l�̐ݒ��ɂ���Ă����������s��
	//---------------------------------------------------------------------------
	prehook : {
		ques : function(num){ if(this.owner.classes.Border.prototype.enableLineCombined){ this.setCombinedLine(num);} return false;},
		qnum : function(num){ return (this.minnum>0 && num===0);},
		anum : function(num){ return (this.minnum>0 && num===0);},
	},
	posthook : {
		qnum : function(num){ this.owner.board.setCellInfoAll(this);},
		anum : function(num){ this.owner.board.setCellInfoAll(this);},
		qans : function(num){ this.owner.board.setCellInfoAll(this);},
		qsub : function(num){ if(this.numberWithMB){ this.owner.board.setCellInfoAll(this);}} /* numberWithMB�́��𕶎����� */
	},

	//---------------------------------------------------------------------------
	// cell.lcnt()       �Z���ɑ��݂�����̖{����Ԃ�
	// cell.iscrossing() �w�肳�ꂽ�Z��/��_�Ő�����������ꍇ��true��Ԃ�
	//---------------------------------------------------------------------------
	lcnt       : function(){ return (!!this.owner.board.lines.lcnt[this.id]?this.owner.board.lines.lcnt[this.id]:0);},
	iscrossing : function(){ return this.owner.board.lines.isLineCross;},

	//---------------------------------------------------------------------------
	// cell.drawaround() �ՖʂɎ����̎���1�}�X���܂߂ĕ`�悷��
	//---------------------------------------------------------------------------
	drawaround : function(){
		this.owner.painter.paintRange(this.bx-3, this.by-3, this.bx+3, this.by+3);
	},

	//---------------------------------------------------------------------------
	// cell.isBlack()   �Y������Cell�����}�X���ǂ����Ԃ�
	// cell.isWhite()   �Y������Cell�����}�X���ǂ����Ԃ�
	// cell.setBlack()  �Y������Cell�ɍ��}�X���Z�b�g����
	// cell.setWhite()  �Y������Cell�ɔ��}�X���Z�b�g����
	//---------------------------------------------------------------------------
	isBlack : function(){ return this.qans===1;},
	isWhite : function(){ return this.qans!==1;},
	setBlack : function(){ this.setQans(1);},
	setWhite : function(){ this.setQans(0);},
	
	//-----------------------------------------------------------------------
	// cell.getNum()     �Y������Cell�̐�����Ԃ�
	// cell.setNum()     �Y������Cell�ɐ�����ݒ肷��
	//-----------------------------------------------------------------------
	getNum : function(){ return (this.qnum!==-1 ? this.qnum : this.anum);},
	setNum : function(val){
		if(this.minnum>0 && val===0){ return;}
		// editmode�� val>=0�͐��� val=-1�͏��� val=-2�́H�Ȃ�
		if(this.owner.editmode){
			val = (((this.numberAsObject||val===-2) && this.qnum===val)?-1:val);
			this.setQnum(val);
			this.setAnum(-1);
			if(this.numberIsWhite) { this.setQans(0);}
			if(this.owner.painter.bcolor==="white"){ this.setQsub(0);}
		}
		// playmode�� val>=0�͐��� val=-1�͏��� numberAsObject�́E��val=-2 numberWithMB�́��~��val=-2,-3
		else if(this.qnum===-1){
			var vala = ((val>-1 && !(this.numberAsObject && this.anum=== val  ))? val  :-1);
			var vals = ((val<-1 && !(this.numberAsObject && this.qsub===-val-1))?-val-1: 0);
			this.setAnum(vala);
			this.setQsub(vals);
			this.setQdir(0);
		}
	},
	
	//-----------------------------------------------------------------------
	// cell.isNum()       �Y������Cell�ɐ��������邩�Ԃ�
	// cell.noNum()       �Y������Cell�ɐ������Ȃ����Ԃ�
	// cell.isValidNum()  �Y������Cell��0�ȏ�̐��������邩�Ԃ�
	// cell.isNumberObj() �Y������Cell�ɐ���or�������邩�Ԃ�
	// cell.sameNumber()  �Q��Cell�ɓ����L���Ȑ��������邩�Ԃ�
	//-----------------------------------------------------------------------
	isNum : function(){ return this.id!==null && (this.qnum!==-1 || this.anum!==-1);},
	noNum : function(){ return this.id!==null && (this.qnum===-1 && this.anum===-1);},
	isValidNum  : function(){ return this.id!==null && (this.qnum>=0||(this.anum>=0 && this.qnum===-1));},
	isNumberObj : function(){ return (this.qnum!==-1 || this.anum!==-1 || (this.numberWithMB && this.qsub===1));},
	sameNumber : function(cell){ return (this.isValidNum() && (this.getNum()===cell.getNum()));},

	//---------------------------------------------------------------------------
	// cell.is51cell()     [�_]�̃Z�����`�F�b�N����(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	// cell.set51cell()    [�_]���쐬����(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	// cell.remove51cell() [�_]����������(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	//---------------------------------------------------------------------------
	// ���Ƃ肠�����J�b�N���p
	is51cell : function(){ return (this.ques===51);},
	set51cell : function(val){
		this.setQues(51);
		this.setQnum(0);
		this.setQdir(0);
		this.setAnum(-1);
	},
	remove51cell : function(val){
		this.setQues(0);
		this.setQnum(0);
		this.setQdir(0);
		this.setAnum(-1);
	},

	//---------------------------------------------------------------------------
	// cell.ice() �A�C�X�̃}�X���ǂ������肷��
	//---------------------------------------------------------------------------
	ice : function(){ return (this.ques===6);},

	//---------------------------------------------------------------------------
	// cell.isEmpty() / cell.isValid() �s��`�ՖʂȂǂŁA���͂ł���}�X�����肷��
	//---------------------------------------------------------------------------
	isEmpty : function(){ return ( this.isnull || this.ques===7);},
	isValid : function(){ return (!this.isnull && this.ques!==7);},

	//---------------------------------------------------------------------------
	// cell.isLineStraight()   �Z���̏�Ő������i���Ă��邩���肷��
	//---------------------------------------------------------------------------
	isLineStraight : function(){
		if     (this.ub().isLine() && this.db().isLine()){ return true;}
		else if(this.lb().isLine() && this.rb().isLine()){ return true;}
		return false;
	},

	//---------------------------------------------------------------------------
	// cell.setCombinedLine() �����̃Z���̐ݒ�ɉ����Ď���̐���ݒ肷��
	// cell.isLP()  �����K�����݂���Z���̏����𔻒肷��
	// cell.noLP()  ���������Ȃ��Z���̏����𔻒肷��
	//---------------------------------------------------------------------------
	setCombinedLine : function(){	// cell.setQues����Ă΂��
		if(this.owner.classes.Border.prototype.enableLineCombined){
			var bx=this.bx, by=this.by;
			var blist = this.owner.board.borderinside(bx-1,by-1,bx+1,by+1);
			for(var i=0;i<blist.length;i++){
				var border=blist[i];
				if        (border.line===0 && border.isLineEX()){ border.setLineVal(1);}
				// ���}�X�����͂��ꂽ����������Ƃ���肽���ꍇ�A���̃R�����g�A�E�g���͂���
				// else if(border.line!==0 && border.isLineNG()){ border.setLineVal(0);}
			}
		}
	},

	// ���L�̊֐��ŗp����萔
	isLPobj : {
		1 : {11:1,12:1,14:1,15:1}, /* k.UP */
		2 : {11:1,12:1,16:1,17:1}, /* k.DN */
		3 : {11:1,13:1,15:1,16:1}, /* k.LT */
		4 : {11:1,13:1,14:1,17:1}  /* k.RT */
	},
	noLPobj : {
		1 : {1:1,4:1,5:1,13:1,16:1,17:1,21:1}, /* k.UP */
		2 : {1:1,2:1,3:1,13:1,14:1,15:1,21:1}, /* k.DN */
		3 : {1:1,2:1,5:1,12:1,14:1,17:1,22:1}, /* k.LT */
		4 : {1:1,3:1,4:1,12:1,15:1,16:1,22:1}  /* k.RT */
	},

	isLP : function(dir){
		return !!this.isLPobj[dir][this.ques];
	},
	// ans.checkenableLineParts����noLP()�֐������ڌĂ΂�Ă���
	noLP : function(dir){
		return !!this.noLPobj[dir][this.ques];
	},

	//---------------------------------------------------------------------------
	// cell.countDir4Cell()  �㉺���E4�����ŏ���func==true�ɂȂ�}�X�̐����J�E���g����
	//---------------------------------------------------------------------------
	countDir4Cell : function(func){
		var cnt=0, cell;
		cell=this.up(); if(!cell.isnull && func(cell)){ cnt++;}
		cell=this.dn(); if(!cell.isnull && func(cell)){ cnt++;}
		cell=this.lt(); if(!cell.isnull && func(cell)){ cnt++;}
		cell=this.rt(); if(!cell.isnull && func(cell)){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// cell.getdir4clist()   �㉺���E4�����̑��݂���Z����Ԃ�
	// cell.getdir4cblist()  �㉺���E4�����̃Z�������E����������Ԃ�
	//---------------------------------------------------------------------------
	getdir4clist : function(){
		var cell, list=[];
		cell=this.up(); if(!cell.isnull){ list.push([cell,k.UP]);}
		cell=this.dn(); if(!cell.isnull){ list.push([cell,k.DN]);}
		cell=this.lt(); if(!cell.isnull){ list.push([cell,k.LT]);}
		cell=this.rt(); if(!cell.isnull){ list.push([cell,k.RT]);}
		return list;
	},
	getdir4cblist : function(){
		var cell, border, cblist=[];
		cell=this.up(); border=this.ub(); if(!cell.isnull || !border.isnull){ cblist.push([cell,border,k.UP]);}
		cell=this.dn(); border=this.db(); if(!cell.isnull || !border.isnull){ cblist.push([cell,border,k.DN]);}
		cell=this.lt(); border=this.lb(); if(!cell.isnull || !border.isnull){ cblist.push([cell,border,k.LT]);}
		cell=this.rt(); border=this.rb(); if(!cell.isnull || !border.isnull){ cblist.push([cell,border,k.RT]);}
		return cblist;
	},

	//---------------------------------------------------------------------------
	// cell.setCellLineError()    �Z���Ǝ���̐��ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	setCellLineError : function(flag){
		var bx=this.bx, by=this.by;
		if(flag){ this.seterr(1);}
		this.owner.board.borderinside(bx-1,by-1,bx+1,by+1).seterr(1);
	}
});

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
pzprv3.createPuzzleClass('Cross:BoardPiece',
{
	group : 'cross',

	iscrossobj : true,

	// �f�t�H���g�l
	ques : 0,	// �����_�̖��f�[�^(���_)��ێ�����
	qnum :-1,	// �����_�̖��f�[�^(����)��ێ�����

	propall : ['ques', 'qnum'],
	propans : [],
	propsub : [],

	//---------------------------------------------------------------------------
	// �I�u�W�F�N�g�ݒ�l��getter/setter
	//---------------------------------------------------------------------------
	getQues : function(){ return this.ques;},
	setQues : function(val){ this.setdata(k.QUES, val);},

	getQnum : function(){ return this.qnum;},
	setQnum : function(val){ this.setdata(k.QNUM, val);},

	//---------------------------------------------------------------------------
	// cross.lcnt()       ��_�ɑ��݂�����̖{����Ԃ�
	// cross.iscrossing() �w�肳�ꂽ�Z��/��_�Ő�����������ꍇ��true��Ԃ�
	//---------------------------------------------------------------------------
	lcnt       : function(){ return (!!this.owner.board.lines.lcnt[this.id]?this.owner.board.lines.lcnt[this.id]:0);},
	iscrossing : function(){ return this.owner.board.lines.isLineCross;}
});

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
pzprv3.createPuzzleClass('Border:BoardPiece',
{
	initialize : function(){
		this.sidecell  = [null,null];	// �אڃZ���̃I�u�W�F�N�g
		this.sidecross = [null,null];	// �אڌ�_�̃I�u�W�F�N�g
		this.lineedge  = [];			// LineManager�p
	},
	group : 'border',

	isborderobj : true,

	// �f�t�H���g�l
	ques : 0,	// ���E���̖��f�[�^��ێ�����(��苫�E��)
	qans : 0,	// ���E���̉񓚃f�[�^��ێ�����(�񓚋��E��)
	qdir : 0,	// ���E���̖��f�[�^��ێ�����(�A�C�X�o�[���̖��/�}�C�i���Y���̕s����)
	qnum :-1,	// ���E���̖��f�[�^��ێ�����(�}�C�i���Y���̐���/�V�̃V���[�̐�)
	line : 0,	// ���̉񓚃f�[�^��ێ�����(�X�������Ȃǂ̐���������)
	qsub : 0,	// ���E���̕⏕�f�[�^��ێ�����(1:�⏕��/2:�~)
	color: "",	// �F�����f�[�^��ێ�����

	isvert: false,	// true:���E��������(�c) false:���E��������(��)

	propall : ['ques', 'qans', 'qdir', 'qnum', 'line', 'qsub'],
	propans : ['qans', 'line', 'qsub'],
	propsub : ['qsub'],

	// isLineNG�֘A�̕ϐ��Ȃ�
	enableLineNG       : false,
	enableLineCombined : false,

	//---------------------------------------------------------------------------
	// �I�u�W�F�N�g�ݒ�l��getter/setter
	//---------------------------------------------------------------------------
	getQues : function(){ return this.ques;},
	setQues : function(val){ this.setdata(k.QUES, val);},

	getQans : function(){ return this.qans;},
	setQans : function(val){ this.setdata(k.QANS, val);},

	getQdir : function(){ return this.qdir;},
	setQdir : function(val){ this.setdata(k.QDIR, val);},

	getQnum : function(){ return this.qnum;},
	setQnum : function(val){ this.setdata(k.QNUM, val);},

	getLineVal : function(){ return this.line;},
	setLineVal : function(val){ this.setdata(k.LINE, val);},

	getQsub : function(){ return this.qsub;},
	setQsub : function(val){ this.setdata(k.QSUB, val);},

	//---------------------------------------------------------------------------
	// prehook  �l�̐ݒ�O�ɂ���Ă���������A�ݒ�֎~�������s��
	// posthook �l�̐ݒ��ɂ���Ă����������s��
	//---------------------------------------------------------------------------
	prehook : {
		qans : function(num){ return (this.ques!==0);},
		line : function(num){ return (this.checkStableLine(num));}
	},
	posthook : {
		ques : function(num){ this.owner.board.setBorderInfoAll(this);},
		qans : function(num){ this.owner.board.setBorderInfoAll(this);},
		line : function(num){ this.owner.board.setLineInfoAll(this);}
	},

	//---------------------------------------------------------------------------
	// border.draw() �ՖʂɎ����̎��͂�`�悷�� (Border�͂�����Ɣ͈͂��L��)
	//---------------------------------------------------------------------------
	draw : function(){
		this.owner.painter.paintRange(this.bx-2, this.by-2, this.bx+2, this.by+2);
	},

	//-----------------------------------------------------------------------
	// border.isLine()      �Y������Border��line��������Ă��邩���肷��
	// border.setLine()     �Y������Border�ɐ�������
	// border.setPeke()     �Y������Border�Ɂ~�������
	// border.removeLine()  �Y������Border�����������
	//-----------------------------------------------------------------------
	isLine : function(){ return this.line>0;},
	setLine    : function(id){ this.setLineVal(1); this.setQsub(0);},
	setPeke    : function(id){ this.setLineVal(0); this.setQsub(2);},
	removeLine : function(id){ this.setLineVal(0); this.setQsub(0);},

	//---------------------------------------------------------------------------
	// border.isBorder()     �Y������Border�ɋ��E����������Ă��邩���肷��
	// border.setBorder()    �Y������Border�ɋ��E��������
	// border.removeBorder() �Y������Border�����������
	//---------------------------------------------------------------------------
	isBorder  : function(){ return (this.ques>0 || this.qans>0);},
	setBorder : function(){
		if(this.owner.editmode){ this.setQues(1); this.setQans(0);}
		else if(this.ques!==1){ this.setQans(1);}
	},
	removeBorder : function(){
		if(this.owner.editmode){ this.setQues(0); this.setQans(0);}
		else if(this.ques!==1){ this.setQans(0);}
	},

	//---------------------------------------------------------------------------
	// border.isVert()  �Y������Border������(�c)���ǂ����Ԃ�
	// border.isHorz()  �Y������Border�ɐ���(��)���ǂ����Ԃ�
	//---------------------------------------------------------------------------
	isVert : function(){ return  this.isvert;},
	isHorz : function(){ return !this.isvert;},

	//---------------------------------------------------------------------------
	// border.checkStableLine() ���������Ȃ� or �K�����݂����ԂɂȂ��Ă��邩���肷��
	// border.isLineEX() �����K�����݂���border�̏����𔻒肷��
	// border.isLineNG() ���������Ȃ�border�̏����𔻒肷��
	//---------------------------------------------------------------------------
	// [pipelink, loopsp], [barns, slalom, reflect, yajirin]�ŌĂ΂��֐�
	checkStableLine : function(num){	// border.setLine����Ă΂��
		if(this.enableLineNG){
			if(this.enableLineCombined){
				return ( (num!==0 && this.isLineNG()) ||
						 (num===0 && this.isLineEX()) );
			}
			return (num!==0 && this.isLineNG());
		}
		return false;
	},

	// cell.setQues => setCombinedLine����Ă΂��֐� (exist->ex)
	//  -> cellid�̕Е���null�ɂȂ��Ă��邱�Ƃ��l�����Ă��܂���
	isLineEX : function(){
		var cell1 = this.sidecell[0], cell2 = this.sidecell[1];
		return this.isVert() ? (cell1.isLP(k.RT) && cell2.isLP(k.LT)) :
							   (cell1.isLP(k.DN) && cell2.isLP(k.UP));
	},
	// border.setLineCal => checkStableLine����Ă΂��֐�
	//  -> cellid�̕Е���null�ɂȂ��Ă��邱�Ƃ��l�����Ă��܂���
	isLineNG : function(){
		var cell1 = this.sidecell[0], cell2 = this.sidecell[1];
		return this.isVert() ? (cell1.noLP(k.RT) || cell2.noLP(k.LT)) :
							   (cell1.noLP(k.DN) || cell2.noLP(k.UP));
	}
});

//---------------------------------------------------------------------------
// ��EXCell�N���X Board�N���X��EXCell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(4)
// EXCell�N���X�̒�`
pzprv3.createPuzzleClass('EXCell:BoardPiece',
{
	group : 'excell',

	isexcellobj : true,

	// �f�t�H���g�l
	qdir : 0,	// �Z���̖��f�[�^(����)��ێ�����(��� or �J�b�N���̉���)
	qnum :-1,	// �Z���̖��f�[�^(����)��ێ�����(���� or �J�b�N���̉E��)

	propall : ['qdir', 'qnum'],
	propans : [],
	propsub : [],

	//---------------------------------------------------------------------------
	// �I�u�W�F�N�g�ݒ�l��getter/setter
	//---------------------------------------------------------------------------
	getQdir : function(){ return this.qdir;},
	setQdir : function(val){ this.setdata(k.QDIR, val);},

	getQnum : function(){ return this.qnum;},
	setQnum : function(val){ this.setdata(k.QNUM, val);}
});

//----------------------------------------------------------------------------
// ��Address�N���X (bx,by)���W������
//---------------------------------------------------------------------------
// Address�N���X
pzprv3.createPuzzleClass('Address',
{
	initialize : function(bx,by){
		this.bx = bx;
		this.by = by;
	},

	reset  : function()   { this.bx = null;  this.by = null;},
	equals : function(pos){ return (this.bx===pos.bx && this.by===pos.by);},
	clone  : function()   { return this.owner.newInstance('Address',[this.bx, this.by]);},

	set  : function(pos)  { this.bx = pos.bx; this.by = pos.by; return this;},
	init : function(bx,by){ this.bx  = bx; this.by  = by; return this;},
	move : function(dx,dy){ this.bx += dx; this.by += dy; return this;},
	rel  : function(dx,dy){ return this.owner.newInstance('Address',[this.bx+dx, this.by+dy]);},

	oncell   : function(){ return !!( (this.bx&1)&& (this.by&1));},
	oncross  : function(){ return !!(!(this.bx&1)&&!(this.by&1));},
	onborder : function(){ return !!((this.bx+this.by)&1);},
	
	getc  : function(){ return this.owner.board.getc(this.bx, this.by);},
	getx  : function(){ return this.owner.board.getx(this.bx, this.by);},
	getb  : function(){ return this.owner.board.getb(this.bx, this.by);},
	getex : function(){ return this.owner.board.getex(this.bx, this.by);},
	
	movedir : function(dir,dd){
		switch(dir){
			case k.UP: this.by-=dd; break;
			case k.DN: this.by+=dd; break;
			case k.LT: this.bx-=dd; break;
			case k.RT: this.bx+=dd; break;
		}
		return this;
	},

	//---------------------------------------------------------------------------
	// pos.draw() �ՖʂɎ����̎��͂�`�悷��
	//---------------------------------------------------------------------------
	draw : function(){
		this.owner.painter.paintRange(this.bx-1, this.by-1, this.bx+1, this.by+1);
	},

	//---------------------------------------------------------------------------
	// pos.isinside() ���̏ꏊ���Ֆʓ����ǂ������f����
	//---------------------------------------------------------------------------
	isinside : function(){
		var bd = this.owner.board;
		return (this.bx>=bd.minbx && this.bx<=bd.maxbx &&
				this.by>=bd.minby && this.by<=bd.maxby);
	}
});

//----------------------------------------------------------------------------
// ��PieceList�N���X �I�u�W�F�N�g�̔z�������
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('PieceList',
{
	length : 0,
	
	name : 'PieceList',
	
	//--------------------------------------------------------------------------------
	// ��Array�I�u�W�F�N�g�֘A�̊֐�
	// list.add()      �^����ꂽ�I�u�W�F�N�g��z��̖����ɒǉ�����(push()����)
	// list.extend()   �^����ꂽPieceList��z��̖����ɒǉ�����
	// list.unshift()  �^����ꂽ�I�u�W�F�N�g��z��̐擪�ɓ����
	// list.pop()      �z��̍Ō�̃I�u�W�F�N�g����菜���ĕԂ�
	// list.reverse()  �ێ����Ă���z��̏��Ԃ��t�ɂ���
	//--------------------------------------------------------------------------------
	add     : Array.prototype.push,
	extend  : function(list){ this.add.apply(this,list);},
	unshift : Array.prototype.unshift,
	pop     : Array.prototype.pop,
	reverse : Array.prototype.reverse,
	
	//--------------------------------------------------------------------------------
	// ��Array�I�u�W�F�N�giterator�֘A�̊֐�
	// list.some()     ������true�ƂȂ�I�u�W�F�N�g�����݂��邩���肷��
	// list.include()  �^����ꂽ�I�u�W�F�N�g���z��ɑ��݂��邩���肷��
	// list.filter()   ������true�ƂȂ�I�u�W�F�N�g�𒊏o����clist��V���ɍ쐬����
	//--------------------------------------------------------------------------------
	some : function(cond){
		this.constructor.prototype.some =
		((!!Array.prototype.some) ? 
			Array.prototype.some
		:
			function(obj){
				for(var i=0;i<this.length;i++){ if(cond(this[i])){ return true;}}
				return false;
			}
		);
		return this.some(cond);
	},
	include : function(target){
		return this.some(function(obj){ return (obj===target);});
	},
	
	filter : function(cond){
		var list = this.owner.newInstance(this.name);
		for(var i=0;i<this.length;i++){ if(cond(this[i])){ list.add(this[i]);}}
		return list;
	},
	
	//--------------------------------------------------------------------------------
	// list.seterr()  �ێ����Ă���I�u�W�F�N�g��error�l��ݒ肷��
	//--------------------------------------------------------------------------------
	seterr : function(num){
		if(!this.owner.board.isenableSetError()){ return;}
		for(var i=0;i<this.length;i++){ this[i].error = num;}
	}
});

//----------------------------------------------------------------------------
// ��CellList�N���X Cell�̔z�������
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('CellList:PieceList',
{
	name : 'CellList',

	//---------------------------------------------------------------------------
	// clist.addByIdlist()  �Z����ID�̃��X�g����Z����ǉ�����
	//---------------------------------------------------------------------------
	addByIdlist : function(idlist){
		for(var i=0;i<idlist.length;i++){
			this.add(this.owner.board.cell[idlist[i]]);
		}
		return this;
	},

	//---------------------------------------------------------------------------
	// clist.getRectSize()  �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA�Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	getRectSize : function(){
		var bd = this.owner.board;
		var d = { x1:bd.maxbx+1, x2:bd.minbx-1, y1:bd.maxby+1, y2:bd.minby-1, cols:0, rows:0, cnt:0};
		for(var i=0;i<this.length;i++){
			var cell = this[i];
			if(d.x1>cell.bx){ d.x1=cell.bx;}
			if(d.x2<cell.bx){ d.x2=cell.bx;}
			if(d.y1>cell.by){ d.y1=cell.by;}
			if(d.y2<cell.by){ d.y2=cell.by;}
			d.cnt++;
		}
		d.cols = (d.x2-d.x1+2)/2;
		d.rows = (d.y2-d.y1+2)/2;
		return d;
	},

	//--------------------------------------------------------------------------------
	// clist.getQnumCell()  �w�肳�ꂽClist�̒��ň�ԍ���ɂ��鐔���̂���Z����Ԃ�
	//--------------------------------------------------------------------------------
	getQnumCell : function(){
		for(var i=0,len=this.length;i<len;i++){
			if(this[i].isNum()){ return this[i];}
		}
		return this.owner.board.emptycell;
	}
});

//----------------------------------------------------------------------------
// ��CrossList�N���X Cross�̔z�������
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('CrossList:PieceList',{
	name : 'CrossList'
});

//----------------------------------------------------------------------------
// ��BorderList�N���X Border�̔z�������
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('BorderList:PieceList',
{
	name : 'BorderList',

	//---------------------------------------------------------------------------
	// clist.addByIdlist()  Border��ID�̃��X�g����Border��ǉ�����
	//---------------------------------------------------------------------------
	addByIdlist : function(idlist){
		for(var i=0;i<idlist.length;i++){
			this.add(this.owner.board.border[idlist[i]]);
		}
		return this;
	},

	//---------------------------------------------------------------------------
	// blist.cellinside()  �����d�Ȃ�Z���̃��X�g���擾����
	// blist.crossinside() �����d�Ȃ��_�̃��X�g���擾����
	//---------------------------------------------------------------------------
	cellinside : function(){
		var clist = this.owner.newInstance('CellList'), pushed = [];
		for(var i=0;i<this.length;i++){
			var border=this[i], cell1=border.sidecell[0], cell2=border.sidecell[1];
			if(!cell1.isnull && pushed[cell1.id]!==true){ clist.add(cell1); pushed[cell1.id]=true;}
			if(!cell2.isnull && pushed[cell2.id]!==true){ clist.add(cell2); pushed[cell2.id]=true;}
		}
		return clist;
	},
	crossinside : function(){
		var clist = this.owner.newInstance('CrossList'), pushed = [];
		for(var i=0;i<this.length;i++){
			var border=this[i], cross1=border.sidecross[0], cross2=border.sidecross[1];
			if(!cross1.isnull && pushed[cross1.id]!==true){ clist.add(cross1); pushed[cross1.id]=true;}
			if(!cross2.isnull && pushed[cross2.id]!==true){ clist.add(cross2); pushed[cross2.id]=true;}
		}
		return clist;
	}
});

//----------------------------------------------------------------------------
// ��EXCellList�N���X EXCell�̔z�������
//---------------------------------------------------------------------------
pzprv3.createPuzzleClass('EXCellList:PieceList',{
	name : 'EXCellList'
});

})();