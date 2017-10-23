function BarMenu(selector){
	
	//프로퍼티 생성하기
	this.$barMenu = null;
	this.$menuBody = null;
	this.$menuItems = null;
	this.$overItems = null;
	this.$bar = null;
	
	
	//선택 메뉴아이템
	this.$selectItem = null;
	
	this.init(selector);
	this.initEvent();
	
}

//오소 초기화
BarMenu.prototype.init = function(selector){
	this.$barMenu = $(selector);
	this.$menuBody = this.$barMenu.find(".menu-body");
	this.$menuItems = this.$menuBody.find("li");
	this.$bar = this.$barMenu.find(".bar");
}

//이벤트 초기화
BarMenu.prototype.initEvent = function(){
	
	var objThis = this;
	
	//오버 메뉴 효과 처리
	this.$menuItems.mouseenter(function(e){
		objThis.setOverMenuItem($(this));
	})
	
	//메뉴 영역을 나간 경우
	this.$barMenu.mouseleave(function(e){
		//기존 오버메뉴아이템이 있는 경우 제거
		objThis.removeOverItem();
	})
	
	//선택 메뉴아이템 처리
	this.$menuItems.click(function(e){
		//기존 오버 메뉴아이템이 있는 경우 제거
		objThis.removeOverItem();
		//선택 메뉴아이템 처리
		objThis.setSelectMenuItem($(this))
	})
}


/*
 * 선택 메뉴 아이템 처리하기
 * $item : 선택  메뉴아이템
 */
BarMenu.prototype.setSelectMenuItem = function($item){
	//선택 메뉴아이템 스타일 처리
	if(this.$selectItem){
		this.$selectItem.removeClass("select");
	}
	
	this.$selectItem = $item;
	this.$selectItem.addClass("select");
	
	//메뉴 바 이동
	this.moveBar($item)
}


/*
 * 오버 메뉴 아이템 처리하기
 * $item : 신규 오버 메뉴아이템
 */
BarMenu.prototype.setOverMenuItem = function($item){
	//기존 오버 메뉴아이템에서 over 스타일 제거
	if(this.$overItem){
		this.$overItem.removeClass("over");
	}
	
	this.$overItem = $item;
	this.$overItem.addClass("over");
	
	//메뉴 바 이동.
	this.moveBar($item)
}


//오버 메뉴아이템 제거
BarMenu.prototype.removeOverItem = function(){
	if(this.$overItem){
		this.$overItem.removeClass("over")
	}
	this.$overItem = null;
	
	this.moveBar(null)
}


BarMenu.prototype.moveBar = function($item){
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
	
	//에니메이션 이동
	this.$bar.stop().animate({
		"left" : left,
		"width" : width
	},300,"easeOutQuint");
	
}

$(document).ready(function(){
	var barMenu = new BarMenu("#barMenu1");
});