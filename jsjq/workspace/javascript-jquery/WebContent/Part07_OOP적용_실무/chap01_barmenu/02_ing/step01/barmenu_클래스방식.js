function BarMenu(selector){
	
	//프로퍼티 생성하기
	this.$barMenu = null;
	this._$menuBody = null;
	this._$menuItems = null;
	this._$overItem = null;
	this._$bar = null;
	
	//선택 메뉴아이템
	this._$selectItem = null;
	
	this._init(selector);
	this._initEvent();
	
}

//오소 초기화
BarMenu.prototype._init = function(selector){
	this.$barMenu = $(selector);
	this._$menuBody = this.$barMenu.find(".menu-body");
	this._$menuItems = this._$menuBody.find("li");
	this._$bar = this.$barMenu.find(".bar");
}

//이벤트 초기화
BarMenu.prototype._initEvent = function(){
	
	var objThis = this;
	
	//오버 메뉴 효과 처리
	this._$menuItems.mouseenter(function(e){
		objThis._setOverMenuItem($(this));
	})
	
	//메뉴 영역을 나간 경우
	this.$barMenu.mouseleave(function(e){
		//기존 오버메뉴아이템이 있는 경우 제거
		objThis._removeOverItem();
		
		//기존 선택 메뉴아이템이 있는 경우 선택 처리 
		objThis._reSelectMenuItem();
	})
	
	//선택 메뉴아이템 처리
	this._$menuItems.click(function(e){
		//기존 오버 메뉴아이템이 있는 경우 제거
		objThis._removeOverItem();
		//선택 메뉴아이템 처리
		objThis.setSelectMenuItem($(this))
	})
}


/*
 * 선택 메뉴 아이템 처리하기
 * $item : 선택  메뉴아이템
 */
BarMenu.prototype.setSelectMenuItem = function($item, animation){
	
	var $oldItem = this._$selectItem;
	
	//선택 메뉴아이템 스타일 처리
	if(this._$selectItem){
		this._$selectItem.removeClass("select");
	}
	
	this._$selectItem = $item;
	this._$selectItem.addClass("select");
	
	//메뉴 바 이동
	this._moveBar($item, animation);
	
	//이벤트 발생 
	this._dispatchSelectEvent($oldItem,$item); 
	
}


/*
 * 오버 메뉴 아이템 처리하기
 * $item : 신규 오버 메뉴아이템
 */
BarMenu.prototype._setOverMenuItem = function($item){
	
	//console.log($item);
	//console.log(this._$selectItem);
	
	//기존 오버 메뉴아이템에서 over 스타일 제거
	if(this._$overItem){
		this._$overItem.removeClass("over");
	}

	
	// >> 기존 오버 메뉴 효과 주석 처리. 
	//this._$overItem = $item;  
	//this._$overItem.addClass("over");

	// 신규 오버 메뉴아이템이 선택 메뉴아이템과 같지 않은 경우에만 오버 메뉴아이템 스타일 적용
	// 선택 메뉴아이템 인덱스 값 구하기
	var selectIndex = -1; //초기화
	if(this._$selectItem!=null){ //선택 메뉴아이템이 있으면 
		
		console.log('>>>> this._$selectItem.index()');
		console.log(this._$selectItem.index());
		selectIndex = this._$selectItem.index();
		
	}
	
	//cf)jquery index()
	/* ==>  특정 노트.index() : 형제요소들 중에서 해당 노득 몇번째인지를 반환한다.(0부터 시작)
	 */
	
	//신규 오버 메뉴아이템의 인덱스 값과 선택 메뉴아이템 인덱스 값을 비교
	if($item.index()!=selectIndex){ // 오버 메뉴아에템이 선택 메뉴아이템이 아닐 경우에만 오버 메뉴 효과를 적용
		//오버 효과 처리 
		this._$overItem = $item;
		this._$overItem.addClass("over") 
	}else{
		this._$overItem = null;
	}
	
	
	//메뉴 바 이동.    
	this._moveBar($item)
}


//오버 메뉴아이템 제거
BarMenu.prototype._removeOverItem = function(){
	if(this._$overItem){
		this._$overItem.removeClass("over")
	}
	this._$overItem = null;
	
	this._moveBar(null)
}


BarMenu.prototype._moveBar = function($item, animation){ //에니메이션 유무를 선택할 수 있는 매개변수 animation
	//초기화
	var left = -100;
	var width = 0;
	
	if($item!=null){
		//메뉴바가 이동할 위치 값 ( $item 메뉴아이템의 현재 위치값 + 마진값 )
		left = $item.position(true).left + parseInt($item.css("margin-left"));;
		//메뉴바의 너비 ( 메뉴아이템에 외각선이 적용되어있기때문에 outerWidth메서드 사용)
		//cf. outerWidth : padding, border값을 포함한 요소의 넓이를 반환.
		width = $item.outerWidth(); 
	}
	
/*	//에니메이션 이동
	this.$bar.stop().animate({
		"left" : left,
		"width" : width
	},300,"easeOutQuint");*/
	
	if(animation == false){
		//에니메이션 없이 바로 이동
		this._$bar.css({
			"left" : left,
			"width" : width
		});
	}else{
		//에니메이션 이동
		this._$bar.stop().animate({
			"left" : left,
			"width" : width
		},300,"easeOutQuint");
	}
	
	
}

//기존 선택 메뉴 아이템이 있는 경우 선택 처리 
BarMenu.prototype._reSelectMenuItem = function(){
	if(this._$selectItem){
		this._moveBar(this._$selectItem)
	}
}


BarMenu.prototype.setSelectMenuItemAt = function(index, animation){ //animation :에니메이션 이동 여부
	this.setSelectMenuItem(this._$menuItems.eq(index),animation)
}


//선택 메뉴 아이템이 변경되는 경우, 이 정보를 이벤트로 만들어 클래스 외부로 알려주는 기능. 

//select 이벤트 발생 
// ㄴ $oldItem : 기존 선택 메뉴아이템
// ㄴ $newItem : 신규 선택 메뉴아이템 
BarMenu.prototype._dispatchSelectEvent = function($oldItem,$newItem){
	
	//jQuery의 Event()유틸리티를 이용해 select라는 사용자 정의 이벤트 객체를 생성
	var event = jQuery.Event("select");
	//매개변수 값으로 들어온 이전선택 메뉴아이템 과 신규 선택 메뉴 아이템을 이벤트 
	event.$oldItem = $oldItem;
	event.$newItem = $newItem;
	
	///★★
	// trigger메서드를 이용해 이벤트를 발생해 준다. 
	// $barMenu => $("#barMenu1") 에서 이벤트를 발생하기 때문에 받을 때에도 
	// #barMenu1에 이벤트 리스너를 등록해야한다.
	this.$barMenu.trigger(event);
	
}

$(document).ready(function(){
	var barMenu = new BarMenu("#barMenu1");
	barMenu.setSelectMenuItemAt(1,false); //이벤트 리스너 등록전이므로 이벤트가 발생해도 아무일도 없음. 
	
	//select 이벤트 리스너 
	barMenu.$barMenu.on("select",function(e){
		var oldIndex = -1;
		if(e.$oldItem)
			oldIndex = e.$oldItem.index();

		console.log("old = " + oldIndex + ", new = "+e.$newItem.index())
	
	})
	
	barMenu.setSelectMenuItemAt(1,false);
	
	//결과
	
	//old = 1, new = 1
});