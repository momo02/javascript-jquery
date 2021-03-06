/*		 * step #03
		 *      - 탭 내용 출력하기
		 *
		 *      step #03-09
		 *          - 리팩토링4 : 중복 코드 없애기
		 *
		 *      step #03-08
		 *          - 리팩토링3 : fade 효과를 메서드로 만들기
		 *
		 *      step #03-07
		 *          - 리팩토링2 : slide 효과를 메서드로 만들기
		 *
		 *      step #03-06
		 *          - 리팩토링1 : 일반 효과를 메서드로 만들기
		 *
		 *      step #03-05
		 *          - 페이드 효과를 적용해 탭 내용 활성화
		 *
		 *      step #03-04
		 *          - showContentAt() 메서드에 출력 효과 애니메이션 실행 유무 매개변수 추가
		 *
		 *      stpe #03-03
		 *          - 슬라이드 효과를 적용해 탭 내용 활성화
		 *
		 *      stpe #03-02
		 *          - 생성자에 effect 매개변수 추가
		 *
		 *      step #03-01
		 *          - 효과 없이 탭 내용 활성화
*/

function TabPanel(selector,effect){
	
	this.$tabPanel = null;
	this.$tabMenu = null;
	this.$tabMenuItems = null;
	this.$selectTabMenuItem = null;
	
	this.$tabContents = null;
	this.$selectTabContent = null;
	this.effect = "";

	this.tabContentWidth = -1;
	
	this.init(selector);
	this.initEvent();
	this.initEffect(effect);
	
	this.initTabContents();
	
	//0번째 탭메뉴 아이템을 기본값으로 선택
	this.setSelectTabMenuItemAt(0,false);
	
}

//요소 초기화
TabPanel.prototype.init = function(selector){
	
	this.$tabPanel = $(selector);
	this.$tabMenu = this.$tabPanel.children(".tab-menu");
	
	this.$tabMenuItems = this.$tabMenu.children("li");
	
	this.$tabContents = this.$tabPanel.find(".tab-contents .content");
	
	this.tabContentWidth = this.$tabPanel.find(".tab-contents").width();
	
}

//이벤트 초기화
TabPanel.prototype.initEvent = function(){
	
	var objThis = this;
	this.$tabMenuItems.on("click",function(e){
		
		//<a>태그 클릭 시 기본 행동 취소
		e.preventDefault();
		//클릭한 탭메뉴 아이템 활성화
		objThis.setSelectTabMenuItem($(this));
	})
}


//탭 콘텐츠 초기화 (모든 탭내용이 화면에 보이지않게 초기화)
TabPanel.prototype.initTabContents = function(){
	this.$tabContents.css({
		opacity : 0
	});
}

//효과 초기화
TabPanel.prototype.initEffect = function(effect){
	this.effect = effect;
	//기본값 설정
	if(this.effect == null){
		this.effect = "none";
	}
	
}



//탭메뉴 아이템 선택
TabPanel.prototype.setSelectTabMenuItem = function($item,animation){
	if(this.$selectTabMenuItem){
		this.$selectTabMenuItem.removeClass("select");
	}	
		this.$selectTabMenuItem = $item;
		this.$selectTabMenuItem.addClass("select");
		
	// 탭메뉴 선택 시, 탭메뉴에 해당하는 탭내용을 활성화하기 위해 
	// 선택된 탭메뉴 인덱스값을 매개변수로  showContentAt메서드 호출.	
	var newIndex = this.$tabMenuItems.index(this.$selectTabMenuItem);
	this.showContentAt(newIndex,animation);
}

//index 번째 탭메뉴 아이템 선택
TabPanel.prototype.setSelectTabMenuItemAt = function(index,animation){
	this.setSelectTabMenuItem(this.$tabMenuItems.eq(index), animation)
	
}


//index에 맞는 탭내용 활성화 
TabPanel.prototype.showContentAt = function(index,animation){
	//1.활성화/비활성화 탭내용 찾기
	var $hideContent = this.$selectTabContent;
	var $showContent = this.$tabContents.eq(index);
	
	if(this.effect == "none" || animation == false){
		
		this.normalEffect($hideContent,$showContent)
	
	}else if(this.effect == "slide"){
		
		this.slideEffect($hideContent,$showContent,index/*,this.tabContentWidth*/);
		
		
	}else if(this.effect == "fade"){
	
		this.fadeEffect($hideContent,$showContent)
	}
	
	//4.선택 탭내용 업데이트
	this.$selectTabContent = $showContent;
	
}


//에니메이션 없는 일반 효과
TabPanel.prototype.normalEffect = function($hideContent,$showContent){
	
	//2.현재 탭내용 비활성화
	if($hideContent){
		$hideContent.css({opacity:0});
	}
	
	//3.신규 탭내용 활성화
	$showContent.css({opacity:1});
	
}



//슬라이드 효과
TabPanel.prototype.slideEffect = function($hideContent,$showContent,showIndex/*,tabContentWidth*/){
	
	var currentIndex = -1;
	if($hideContent){
		currentIndex = $hideContent.index();1
	}

	//이동 방향 구하기
	var direction ="";
	if(currentIndex<showIndex){ //기존인덱스가 새로운 인덱스보다 작으면
		direction = "next";
	}else{
		direction = "prev";
	}
	
	if(direction == "next"){
		//기존이미지는 왼쪽으로 사라지고, 새이미지는 오른쪽에서 나타남.
		hideEndLeft = /*-tabContentWidth;*/-this.tabContentWidth;
		showStartLeft = /*tabContentWidth;*/this.tabContentWidth;
		
	}else{ //prev
		//기존이미지는 오른쪽으로 사라지고, 새이미지는 왼쪽에서 나타남.
		hideEndLeft = /*tabContentWidth;*/this.tabContentWidth;
		showStartLeft = /*-tabContentWidth;*/-this.tabContentWidth;
		
	}
	
	//현재 탭내용 비활성화
	if($hideContent){
		$hideContent.stop().animate({
			left : hideEndLeft,
			opacity : 0
		}, 500, "easeOutQuint")
	}
	
	//신규 탭내용 활성화
	
	//신규 탭내용 위치 초기화
	$showContent.css({
		left : showStartLeft,
		opacity : 0
	})
	
	//신규 탭내용 애니메이션 적용 
	$showContent.stop().animate({
		left : 0,
		opacity : 1
	}, 500, "easeOutQuint")
	
}


//페이드 효과
TabPanel.prototype.fadeEffect = function($hideContent,$showContent){
	
	//현재 탭내용 비활성화
	if($hideContent){
		$hideContent.stop().animate({
			left : 0,
			opacity : 0
		}, 500, "easeOutQuint")
	}
	
	//신규 탭내용 활성화
	$showContent.stop().animate({
		left : 0,
		opacity : 1
	}, 500, "easeOutQuint")
	
	
}