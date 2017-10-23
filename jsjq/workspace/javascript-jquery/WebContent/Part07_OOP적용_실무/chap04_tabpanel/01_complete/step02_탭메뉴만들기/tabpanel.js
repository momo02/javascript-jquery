
//step #02
function TabPanel(selector){
    this.$tabPanel = null;
    this.$tabMenu = null;
    this.$tabMenuItems = null;
    this.$selectTabMenuItem = null;
    
    this.init(selector);
    this.initEvent();
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
}

/*
 * step #02
 *      index 번째 탭메뉴 아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItemAt=function(index){
    this.setSelectTabMenuItem(this.$tabMenuItems.eq(index));
}

