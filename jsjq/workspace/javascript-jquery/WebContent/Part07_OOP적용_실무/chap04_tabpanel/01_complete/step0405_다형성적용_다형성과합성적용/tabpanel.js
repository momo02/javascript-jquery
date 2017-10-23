/*
 * step #03-03 
 *      - effect 추가
 */
//step #02
function TabPanel(selector, effect){
    this.$tabPanel = null;
    this.$tabMenu = null;
    this.$tabMenuItems = null;
    this.$selectTabMenuItem = null;
    
    // step #03-01
    this.$tabContents = null;
    this.$selectTabContent = null;

    
    // step #03-03
    //this.effect= "";
    // step #04-05
    this.effect= null;
    this.tabContentWidth = -1;
    
    
    this.init(selector);
    this.initEvent();
    
    // step #03-02
    this.initEffect(effect);
    
    // step #03-01
    this.initTabContents();
    this.setSelectTabMenuItemAt(0,false);
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
    
     // step #03-03
    this.tabContentWidth = this.$tabPanel.find(".tab-contents").width();   
}

/*
 * step #03-02 
 * 효과 초기화
 */
TabPanel.prototype.initEffect=function(effect){

    this.effect = effect;
    // 기본 값 설정
    if(this.effect==null){  
        //this.effect = "none";
        // step #04-05
        this.effect = TabPanel.normalEffect;
    }
}

/*
 * step #02
 *      이벤트 초기화 
 * 
 */
TabPanel.prototype.initEvent=function(){
    var objThis = this;
    this.$tabMenuItems.on("click",function(e){
        e.preventDefault();
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
 * step #03-04
 *      - animation 추가
 * 
 * sptep #02
 *      탭 메뉴  아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItem=function($item, animation){
    if(this.$selectTabMenuItem){
        this.$selectTabMenuItem.removeClass("select");
    }
    this.$selectTabMenuItem = $item;
    this.$selectTabMenuItem.addClass("select"); 
    
    // step #03-01
    var newIndex = this.$tabMenuItems.index(this.$selectTabMenuItem);
    this.showContentAt(newIndex, animation); 
                  
}


/*
 * step #03-04
 *      - animation 추가
 * 
 * step #02
 *      index 번째 탭메뉴 아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItemAt=function(index, animation){
    this.setSelectTabMenuItem(this.$tabMenuItems.eq(index), animation);
}


/*
 * step #03-04
 *      - animation 추가 
 * step #03-01
 * index에 맞는 탭 내용 활성화
 */
TabPanel.prototype.showContentAt=function(index, animation){
    // 1. 활성화/비활성화 탭 내용 찾기
    var $hideContent = this.$selectTabContent;
    var $showContent =  this.$tabContents.eq(index);
    /*
    // step #03-02
    if(this.effect=="none" || animation==false){
        // step #03-06 
        //this.normalEffect($hideContent, $showContent)
         // step #04-02
        TabPanel.normalEffect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent
        });
        
   // step #03-03 슬라이드 효과 추가
    }else if(this.effect=="slide"){ 
        // step #03-07
        //this.slideEffect($hideContent, $showContent, index, this.tabContentWidth);
        // step #04-03         
        TabPanel.slideEffect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent,            
            showIndex:index,
            tabContentWidth: this.tabContentWidth            
        });
        
        // step #03-05 페이드 효과    
    }else if(this.effect=="fade") { 
        // step #03-08  
        //this.fadeEffect($hideContent,$showContent);
        
        // step #04-04
           TabPanel.fadeEffect.effect({
                $hideContent:$hideContent,
                $showContent:$showContent
           })
    }
    */
   
   // step #04-05
    if(animation==false){
        TabPanel.normalEffect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent
        });
       
    }else {
   
        this.effect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent,            
            showIndex:index,
            tabContentWidth: this.tabContentWidth            
        });
    }
    // step #03-09
    // 4. 선택 탭 내용 업데이트 
    this.$selectTabContent = $showContent;
}

/*
 * step #03-06
 * 애니메이션 없는 일반 효과
 */
TabPanel.prototype.normalEffect=function($hideContent, $showContent){
    // 2. 현재 탭 내용 비활성화
    if($hideContent){
        $hideContent.css({opacity:0})
    }
    
    // 3. 신규 탭 내용 활성화
    $showContent.css({opacity:1});
}



/*
 * step #03-07
 * 슬라이드 효과
 */
TabPanel.prototype.slideEffect=function($hideContent, $showContent, showIndex, tabContentWidth){
     var currentIndex = -1;
     if($hideContent){
         currentIndex= $hideContent.index();
     }

    // 이동 방향 구하기
    var direction = "";
    if(currentIndex<showIndex) 
        direction = "next";
    else
        direction = "prev";
           
    
    // 이동 위치 구하기
    // prev가 기본
    var hideEndLeft = 0;
    var showStartLeft = 0;

    if(direction=="next"){
        hideEndLeft = -tabContentWidth;
        showStartLeft = tabContentWidth;
    }else {
        hideEndLeft =  tabContentWidth;
        showStartLeft = - tabContentWidth;
    }
    
    // 2. 현재 탭 내용 비활성화
    if($hideContent){
        $hideContent.stop().animate({
            left:hideEndLeft,
            opacity:0
        }, 500, "easeOutQuint");
    }
    
    // 3. 신규 탭 내용 활성화
    // 신규 탭 내용 위치 초기화
    $showContent.css({
        left:showStartLeft,
        opacity:0
    } )
   
    // 신규 탭 내용 애니메이션 적용 
    $showContent.stop().animate({
        left:0,
        opacity:1
    }, 500, "easeOutQuint");
}



/*
 * step #03-08
 * fade 효과 
 */
TabPanel.prototype.fadeEffect=function($hideContent, $showContent){
    // 2. 현재 탭 내용 비활성화
    if($hideContent){
        $hideContent.stop().animate({
            left:0,
            opacity:0
        }, 500, "easeOutQuint");
    }
    
    // 3. 신규 탭 내용 활성화
    $showContent.stop().animate({
        left:0,
        opacity:1
    }, 500, "easeOutQuint");
}


//step #04-02
// 일반 출력 효과 
TabPanel.normalEffect={
    effect:function(params){
        if(params.$hideContent){
            params.$hideContent.css({
                left:0,
                opacity:0
            });
        }
        
        params.$showContent.css({
            left:0,
            opacity:1
        }); 
    }
}


/*
 * step #04-03
 * 슬라이드 출력 효과
 */
TabPanel.slideEffect={
    effect:function(params){        
        var hideIndex = -1;
         if(params.$hideContent){
             hideIndex= params.$hideContent.index();
         }
    
        // 이동 방향 구하기
        var direction = "";
        if(hideIndex<params.showIndex) 
            direction = "next";
        else
            direction = "prev";
               
        
        // 이동 위치 구하기
        // prev가 기본
        var hideEndLeft = 0;
        var showStartLeft = 0;
    
        if(direction=="next"){
            hideEndLeft = -params.tabContentWidth;
            showStartLeft = params.tabContentWidth;
        }else {
            hideEndLeft =  params.tabContentWidth;
            showStartLeft = -params.tabContentWidth;
        }
        
        // 2. 현재 탭 내용 비활성화
        if(params.$hideContent){
            params.$hideContent.stop().animate({
                left:hideEndLeft,
                opacity:0
            }, 500, "easeOutQuint");
        }
        
        // 3. 신규 탭 내용 활성화
        // 신규 탭 내용 위치 초기화
        params.$showContent.css({
            left:showStartLeft,
            opacity:0
        } )
       
        // 신규 탭 내용 애니메이션 적용 
        params.$showContent.stop().animate({
            left:0,
            opacity:1
        }, 500, "easeOutQuint");
    }

}


/*
 * step #04-04
 * 페이드 출력 효과
 */
TabPanel.fadeEffect={
    effect:function(params){
         // 2. 현재 탭 내용 비활성화
        if(params.$hideContent){
            params.$hideContent.stop().animate({
                left:0,
                opacity:0
            }, 500, "easeOutQuint");
        }
        
        // 3. 신규 탭 내용 활성화
        params.$showContent.stop().animate({
            left:0,
            opacity:1
        }, 500, "easeOutQuint");
    }
}
