function addEvent(ele,act,lis){
	if(ele.addEventListener){
		ele.addEventListener(act,lis);
	}else if(ele.attachEvent){
		ele.attachEvent("on"+act,lis);//ie8
	}else{
		ele["on"+act]=lis;
	}
}
function removeEvent(ele,act,lis){
	if(ele.removeEventListener){
		ele.removeEventListener(act,lis);
	}else if(ele.detachEvent){
		ele.detachEvent("on"+act,lis);//ie8
	}else{
		ele["on"+act]=null;
	}
}
function stopDefault(e){
	if(e&&e.preventDefault){
		e.preventDefault();
	}else{
		window.event.returnValue=false;//ie
		return false;
	}
}
function stopBubble(e){
	if(e&&e.stopPropagation){
		e.stopPropagation();
	}else{
		window.event.cancelBubble=true;
	}
}
function currentStyle(ele,pro){
	if(window.getComputedStyle){
		return window.getComputedStyle(ele)[pro];
	}else{
		return ele.currentStyle[pro];//ie
	}
}//返回值有单位
function startMove(obj,pro,target,f){//对象,属性,目标,速度(越大越慢)
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
function getByClass(obj,sClass){
	var aEle=obj.getElementsByTagName('*');
	var aResult=[];
	for(var i=0,len=aEle.length;i<len;i++){
		if(aEle[i].className.search(sClass)!=-1){
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}
function css(ele,obj){//js设置行内css，参数为对象，可传多个属性
	for(var i in obj){
		ele.style[i]=obj[i];
	}
}
function combineObj(mySetting,userSetting){//默认设置 用户设置
	var newObj={},
		i;
	for(i in mySetting){
		newObj[i]=userSetting.hasOwnProperty(i)?userSetting[i]:mySetting[i];
	}
	return newObj;
}