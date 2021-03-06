/*	    * step #05
		 *      옵션값 만들기
		 *      step #05-02
		 *          - 옵션값 적용
		 *      step #05-01
		 *          - 옵션값 만들기
*/

function TabPanel(selector,options){
	
	this.$tabPanel = null;
	this.$tabMenu = null;
	this.$tabMenuItems = null;
	this.$selectTabMenuItem = null;
	
	this.$tabContents = null;
	this.$selectTabContent = null;
	//this.effect = "";
	this.effect = null;
	
	this.options = null;
	this.tabContentWidth = -1;
	
	this.init(selector);
	this.initEvent();
	//this.initEffect(effect);
	this.initOptions(options);
	
	
	this.initTabContents();
	
	//0번째 탭메뉴 아이템을 기본값으로 선택
	//this.setSelectTabMenuItemAt(0,false);
	
	this.setSelectTabMenuItemAt(this.options.startIndex,false);
	
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
/*TabPanel.prototype.initEffect = function(effect){
	this.effect = effect;
	//기본값 설정
	if(this.effect == null){
		//this.effect = "none";
		this.effect = TabPanel.normalEffect;
		
	}
}*/

//기본 옵션값
TabPanel.defaultOptions = {
		startIndex : 0,
		easing : "easeInCubic",
		duration : 500,
		effect : TabPanel.slideEffect
}


TabPanel.prototype.initOptions = function(options){
	this.options = jQuery.extend({},TabPanel.defaultOptions,options)
	this.effect = this.options.effect;
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
	
	if(animation == false){
		
		//this.normalEffect($hideContent,$showContent)
	
		TabPanel.normalEffect.effect({ //오브젝트 리터럴로 만들어 전달.
			$hideContent : $hideContent,
			$showContent : $showContent
		})
		
	}else{
		
		this.effect.effect({ //오브젝트 리터럴로 만들어 전달.
			$hideContent : $hideContent,
			$showContent : $showContent,
			showIndex : index,
			tabContentWidth : this.tabContentWidth,
			//추가
			duration : this.options.duration,
			easing : this.options.easing
			
		})
		
		//이렇게 코딩을 해두면 신규 효과가 추가된다 하더라도
		//더이상 showContentAt()메서드를 수정하지않아도 된다.!!!
		
	}
//	else if(this.effect == "slide"){
//		
//		//this.slideEffect($hideContent,$showContent,index/*,this.tabContentWidth*/);
//		TabPanel.slideEffect.effect({
//			$hideContent : $hideContent,
//			$showContent : $showContent,
//			showIndex : index,
//			tabContentWidth : this.tabContentWidth
//		})
//		
//	}else if(this.effect == "fade"){
//	
//		//this.fadeEffect($hideContent,$showContent)
//		TabPanel.fadeEffect.effect({
//			$hideContent : $hideContent,
//			$showContent : $showContent
//		})
//	}
	
	//4.선택 탭내용 업데이트
	this.$selectTabContent = $showContent;
	
}


///하나의 독립된 클래스로 분리.
//일반 출력 효과
TabPanel.normalEffect = {
		effect : function(params){
			//2.현재 탭내용 비활성화
			if(params.$hideContent){
				params.$hideContent.css({
					left :0,
					opacity:0
				});
			}
			
			//3.신규 탭내용 활성화
			params.$showContent.css({
				left : 0,
				opacity:1
			});
			
		}
		
}



//슬라이드 효과
TabPanel.slideEffect = {
		effect : function(params){
			var currentIndex = -1;
			if(params.$hideContent){
				currentIndex = params.$hideContent.index();1
			}

			//이동 방향 구하기
			var direction ="";
			if(currentIndex<params.showIndex){ //기존인덱스가 새로운 인덱스보다 작으면
				direction = "next";
			}else{
				direction = "prev";
			}
			
			if(direction == "next"){
				//기존이미지는 왼쪽으로 사라지고, 새이미지는 오른쪽에서 나타남.
				hideEndLeft = -params.tabContentWidth;
				showStartLeft = params.tabContentWidth;
				
			}else{ //prev
				//기존이미지는 오른쪽으로 사라지고, 새이미지는 왼쪽에서 나타남.
				hideEndLeft = params.tabContentWidth;
				showStartLeft = -params.tabContentWidth;
				
			}
			
			//현재 탭내용 비활성화
			if(params.$hideContent){
				params.$hideContent.stop().animate({
					left : hideEndLeft,
					opacity : 0
				}, params.duration, params.easing)
			}
			
			//신규 탭내용 활성화
			
			//신규 탭내용 위치 초기화
			params.$showContent.css({
				left : showStartLeft,
				opacity : 0
			})
			
			//신규 탭내용 애니메이션 적용 
			params.$showContent.stop().animate({
				left : 0,
				opacity : 1
			}, params.duration, params.easing)
		
}

}


//페이드 효과
TabPanel.fadeEffect = {
		effect : function(params){
			
			//현재 탭내용 비활성화
			if(params.$hideContent){
				params.$hideContent.stop().animate({
					left : 0,
					opacity : 0
				},params.duration, params.easing)
			}
			
			//신규 탭내용 활성화
			params.$showContent.stop().animate({
				left : 0,
				opacity : 1
			}, params.duration, params.easing)
			
		}
}