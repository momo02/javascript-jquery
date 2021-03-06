/*		 * step #03
		 *      - 탭 내용 출력하기
		 *
	
		 *
		 *      step #03-01
		 *          - 효과 없이 탭 내용 활성화
*/

function TabPanel(selector){
	
	this.$tabPanel = null;
	this.$tabMenu = null;
	this.$tabMenuItems = null;
	this.$selectTabMenuItem = null;
	
	this.$tabContents = null;
	this.$selectTabContent = null;
	
	this.init(selector);
	this.initEvent();
	
	this.initTabContents();
	
	//0번째 탭메뉴 아이템을 기본값으로 선택
	this.setSelectTabMenuItemAt(0);
	
}

//요소 초기화
TabPanel.prototype.init = function(selector){
	
	this.$tabPanel = $(selector);
	this.$tabMenu = this.$tabPanel.children(".tab-menu");
	
	this.$tabMenuItems = this.$tabMenu.children("li");
	
	this.$tabContents = this.$tabPanel.find(".tab-contents .content");
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


//탭메뉴 아이템 선택
TabPanel.prototype.setSelectTabMenuItem = function($item){
	if(this.$selectTabMenuItem){
		this.$selectTabMenuItem.removeClass("select");
	}	
		this.$selectTabMenuItem = $item;
		this.$selectTabMenuItem.addClass("select");
		
	// 탭메뉴 선택 시, 탭메뉴에 해당하는 탭내용을 활성화하기 위해 
	// 선택된 탭메뉴 인덱스값을 매개변수로  showContentAt메서드 호출.	
	var newIndex = this.$tabMenuItems.index(this.$selectTabMenuItem);
	this.showContentAt(newIndex);
}

//index 번째 탭메뉴 아이템 선택
TabPanel.prototype.setSelectTabMenuItemAt = function(index){
	this.setSelectTabMenuItem(this.$tabMenuItems.eq(index))
	
}


//index에 맞는 탭내용 활성화 
TabPanel.prototype.showContentAt = function(index){
	//1.활성화/비활성화 탭내용 찾기
	var $hideContent = this.$selectTabContent;
	var $showContent = this.$tabContents.eq(index);
	
	//2.현재 탭내용 비활성화
	if($hideContent){
		$hideContent.css({opacity:0});
	}
	
	//3.신규 탭내용 활성화
	$showContent.css({opacity:1});
	
	//4.선택 탭내용 업데이트
	this.$selectTabContent = $showContent;
	
}