
//step #02
function TabPanel(selector){
    this.$tabPanel = null;
    this.$tabMenu = null;
    this.$tabMenuItems = null;
    this.$selectTabMenuItem = null;
    
    // step #03-01
    this.$tabContents = null;
    this.$selectTabContent = null;
    
    
    this.init(selector);
    this.initEvent();
    // step #03-01
    this.initTabContents();
    
    this.setSelectTabMenuItemAt(0);
}

/*
 * step #02
 *      요소 초기화
 * 
 */
TabPanel.prototype.init=function(selector){
    this.$tabPanel = $(selector);
    this.$tabMenu = this.$tabPanel.children(".tab-menu");

    this.$tabMenuItems = this.$tabMenu.children("li");
    
    // step #03-01
    this.$tabContents = this.$tabPanel.find(".tab-contents .content");
   
}

/*
 * step #02
 *      이벤트 초기화 
 * 
 */
TabPanel.prototype.initEvent=function(){
    var objThis = this;
    this.$tabMenuItems.on("click",function(e){
        // <a>태그 클릭시 기본 행동 취소
        e.preventDefault();
        // 클릭한 탭 메뉴 아이템 활성화
        objThis.setSelectTabMenuItem($(this));
    })
}


/* step #03-01
 * 탭 콘텐츠 초기화
 */
TabPanel.prototype.initTabContents=function(){
    this.$tabContents.css({
        opacity:0}
     );
}





/*
 * sptep #02
 *      탭 메뉴  아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItem=function($item){
    if(this.$selectTabMenuItem){
        this.$selectTabMenuItem.removeClass("select");
    }
    this.$selectTabMenuItem = $item;
    this.$selectTabMenuItem.addClass("select");	
    
    // step #03-01
    var newIndex = this.$tabMenuItems.index(this.$selectTabMenuItem);
    this.showContentAt(newIndex); 
                  
}


/*
 * step #02
 *      index 번째 탭메뉴 아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItemAt=function(index){
    this.setSelectTabMenuItem(this.$tabMenuItems.eq(index));
}


/* #step #03-01
index에 맞는 탭 내용 활성화
* */
TabPanel.prototype.showContentAt=function(index){
  
   // 1. 활성화/비활성화 탭 내용 찾기
   var $hideContent = this.$selectTabContent;
   var $showContent =  this.$tabContents.eq(index);
   
   // 2. 현재 탭 내용 비활성화
    if($hideContent){
        $hideContent.css({opacity:0})
    }
    
    // 3. 신규 탭 내용 활성화
    $showContent.css({opacity:1});
    
    // 4. 선택 탭 내용 업데이트 
    this.$selectTabContent = $showContent;

}



