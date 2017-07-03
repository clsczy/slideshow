;(function(){
	function addEvent(ele,act,lis){
		if(ele.addEventListener){
			ele.addEventListener(act,lis);
		}else if(ele.attachEvent){
			ele.attachEvent("on"+act,lis);//ie8
		}else{
			ele["on"+act]=lis;
		}
	}
	function currentStyle(ele,pro){
		if(window.getComputedStyle){
			return window.getComputedStyle(ele)[pro];
		}else{
			return ele.currentStyle[pro];//ie
		}
	}//返回值有单位	
	function css(ele,obj){//js设置行内css，参数为对象，可传多个属性
		for(var i in obj){
			ele.style[i]=obj[i];
		}
	}
	function combineObj(mySetting,userSetting){
		var newObj={},
			i;
		for(i in mySetting){
			newObj[i]=userSetting.hasOwnProperty(i)?userSetting[i]:mySetting[i];
		}
		return newObj;
	}
	function Slider(id,userSetting){
		var _this=this;
		this.ele=document.getElementById(id);
		this.mySetting={
			index:1,                //1~this.len
			speed:2000,				//ms
			isAutoPlay:true,		//true、false
			hasText:true,			//true、false
			dlPosition:'center'		//'right',除此之外都是'center'
		}
		this.bool=(function(){      //若用户自定义与参数传入发生冲突，以用户自定义为准
			for(var i in _this.mySetting){
				if(_this.ele.dataset.hasOwnProperty(i))
					return true;
			}
			return false;
		})();
		userSetting=this.bool?this.ele.dataset:userSetting||{};
		
		this.finalSetting=combineObj(this.mySetting,userSetting);
		this.current=this.finalSetting.index-1;
		this.speed=this.finalSetting.speed;

		this.lis=this.ele.querySelectorAll('li');
		this.train=this.ele.querySelector('ul');
		this.train.wid=this.train.offsetWidth;
		this.len=this.lis.length;
		this.timer=null;
		this.prev=null;this.next=null;this.dl=null;this.dds=[];this.textArea=null;
		this.createBom();
		this.lis1=this.ele.querySelectorAll('li');
		this.len1=this.len+1;
		addEvent(this.prev,'click',function(){
			_this.prevMove();
		});
		addEvent(this.next,'click',function(){
			_this.nextMove();
		});
		for(var i=0;i<this.len;i++){
			addEvent(this.dds[i],'mouseenter',(function(cur){
				return function(){
					_this.goTo(cur);
				}
			})(i))
		}
		this.setText();
		css(this.train,{left:-this.current*this.train.wid/10+'px'});
		if(this.finalSetting.isAutoPlay.toString()==="true"){
			addEvent(this.ele,'mouseenter',function(){
				_this.pause();
			});
			addEvent(this.ele,'mouseleave',function(){
				_this.autoPlay();
			});
			this.autoPlay();
		}
	}
	Slider.prototype.startMove=function(obj,pro,target,f){
		var _this=this;
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			var cur=0;
			if(pro=="opacity"){
				cur=Math.round(parseFloat(currentStyle(obj,pro))*100);
			}else{
				cur=parseInt(currentStyle(obj,pro));
			}
			var speed=(target-cur)/f;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			if(cur==target){
				clearInterval(obj.timer);
			}else{
				if(pro=="opacity"){
					obj.style.filter='alpha(opacity:'+(cur+speed)+')';
					obj.style.opacity=(cur+speed)/100;
				}else{
					obj.style[pro]=cur+speed+"px";
				}
			}
		},30);
	}
	Slider.prototype.ddsChange=function(n){
		for(var i=0;i<this.len;i++){
			this.dds[i].className='';
		}
		this.dds[n].className="focus";
	}
	Slider.prototype.goTo=function(n){
		if((this.current===this.len-1&&n===0)||(this.current===this.len&&n===1)){
			this.nextMove();
		}else if(this.current===0&&n===this.len-1){
			this.prevMove();
		}else{
			this.current=n;
			this.startMove(this.train,'left',-this.current*this.train.wid/10,6);
			this.ddsChange(this.current);
		}
		this.setText();
	}
	Slider.prototype.nextMove=function(){
		if(this.current===this.len){
			css(this.train,{left:0});
			this.current=1;
		}else{
			this.current=(this.current+1)%this.len1;
		}
		this.startMove(this.train,'left',-this.current*this.train.wid/10,6);
		if(this.current===this.len){
			this.ddsChange(0);
		}else{
			this.ddsChange(this.current);
		}
		this.setText();
	}
	Slider.prototype.prevMove=function(){
		if(this.current===0){
			css(this.train,{left:-this.len*this.train.wid/10+'px'});
			this.current=this.len-1;
		}else{
			this.current=(this.current-1+this.len1)%this.len1;
		}
		this.startMove(this.train,'left',-this.current*this.train.wid/10,6);
		this.ddsChange(this.current);
		this.setText();
	}
	Slider.prototype.autoPlay=function(){
		var _this=this;
		this.pause();
		this.timer=setInterval(function(){
			_this.nextMove();
		},this.speed);
	}
	Slider.prototype.pause=function(){
		clearInterval(this.timer);
	}
	Slider.prototype.setText=function(){
		this.textArea.innerHTML=this.lis1[this.current].getAttribute('text');
	}
	Slider.prototype.createBom=function(){
		this.train.appendChild(this.lis[0].cloneNode(true));
		this.prev=document.createElement('span');
		this.next=document.createElement('span');
		this.prev.className="span";
		this.next.className="next span";
		this.ele.appendChild(this.prev);
		this.ele.appendChild(this.next);
		this.dl=document.createElement('dl');
		for(var i=0;i<this.len;i++){
			var dd=document.createElement('dd');
			this.dl.appendChild(dd);
			this.dds.push(dd);
		}
		this.dl.className=(this.finalSetting.dlPosition==="right")?"change right":"change";
		this.dds[this.current].className="focus";
		this.ele.appendChild(this.dl);
		this.textArea=document.createElement('div');
		this.textArea.className="text";
		this.ele.appendChild(this.textArea);
		if(this.finalSetting.hasText.toString()==='false'){
			css(this.textArea,{display:'none'});
		}
	}
	window.Slider=Slider;
})();