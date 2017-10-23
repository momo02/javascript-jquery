
(function($){
    // step #07-01  
    // folderAccordionMenu 플러그인
    $.fn.folderAccordionMenu=function(){
        // 선택자에 해당하는 요소 개수 만큼 FolderAccordionMenu 객체 생성
        this.each(function(index){
            var $this = $(this);
            var menu = new FolderAccordionMenu($this);
            
        });
        
        return this;
    }
})(jQuery);


// step #02-01
function FolderAccordionMenu(selector){
    this.$accordionMenu = null;
    this._$mainMenuItems = null;
    
    // step #03
    // 선택 서브 메뉴 아이템 
    this._$selectSubItem = null;
    
    
    this._init(selector);
    this._initSubMenuPanel();
    
    // step #02-03
    this._initEvent();

}

/* step #02-01
* 요소 초기화
*/
FolderAccordionMenu.prototype._init=function(selector){
    this.$accordionMenu = $(selector);
    this._$mainMenuItems = this.$accordionMenu.children("li");   
}
    
    /* step #02-03
    * 이벤트 초기화
    */
FolderAccordionMenu.prototype._initEvent=function(){
    var objThis = this;
    this._$mainMenuItems.children(".main-title").click(function(e){
        var $item = $(this).parent();
        objThis.toggleSubMenuPanel($item);
    })
    
    // step #03
    this._$mainMenuItems.find(".sub li").click(function(e){
        objThis._selectSubMenuItem($(this));
    })
}

/* step #02-01
*  서브 패널 초기화 - 초기 시작히 닫힌 상태로 만들기 
*/
FolderAccordionMenu.prototype._initSubMenuPanel=function(){  
    var objThis =  this;
    this._$mainMenuItems.each(function(index){
        var $item = $(this);
        var $subMenu = $item.find(".sub");
        
        // 서브가 없는 경우 
        if($subMenu.length==0){
            $item.attr("data-extension","empty");           
            objThis._setFolderState($item, "empty");
        
        }else {
            if($item.attr("data-extension")=="open"){                           
                objThis.openSubMenu($item, false);
                
            }else{
                objThis.closeSubMenu($item,false);
            }
        }
    })
}

/* step #02-01
* 폴더 상태 설정
*/  
FolderAccordionMenu.prototype._setFolderState=function($item,state){
    var $folder = $item.find(".main-title .folder");
    // 기존 클래스를 모두 제거
    $folder.removeClass();
    $folder.addClass("folder "+state);

}

/*
* step #02-02
* 서브 메뉴 패널 열기 
* animation 기본 값은 true
*/
FolderAccordionMenu.prototype.openSubMenu=function($item, animation){

    if($item != null){
        $item.attr("data-extension", "open");
        
        var $subMenu = $item.find(".sub");
        
        // step #02-04
        if(animation==false){
            $subMenu.css({
                marginTop:0
            });
        }else {
            $subMenu.stop().animate({
                    marginTop:0
                },300,"easeInCubic"
            );
        }
        
        this._setFolderState($item, "open");
        
        // step #05-01
        // open 이벤트 발생
        this._dispatchOpenCloseEvent($item, "open");
    }
}

/*
* step #02-02
* 서브 메뉴 패널 닫기
* animation 기본 값은 true
*/
FolderAccordionMenu.prototype.closeSubMenu=function($item, animation){
    if($item != null){
        $item.attr("data-extension", "close");
        
        var $subMenu = $item.find(".sub");
        
        // step #02-04
        var subMenuPanelHeight = -$subMenu.outerHeight(true);
        if(animation==false){
            $subMenu.css({
                marginTop:subMenuPanelHeight
            });
        }else {
            $subMenu.stop().animate({
                    marginTop:subMenuPanelHeight
                },300,"easeInCubic"
            );
        }
        
        this._setFolderState($item, "close");
        
        // step #05-01
        // close 이벤트 발생
        this._dispatchOpenCloseEvent($item, "close");
    }
}

/*
* step #02-03
* 서브메뉴 패널 열고 닫기 
*/
FolderAccordionMenu.prototype.toggleSubMenuPanel=function($item){
    var extension = $item.attr("data-extension");
    
    // 서브가 없는 경우 취소
    if(extension=="empty"){
        return;
    }

    if(extension=="open"){      
        this.closeSubMenu($item);
    }else{
        this.openSubMenu($item);
    }
}

/*
 * step #02-05
 * index 메뉴의 서브 메뉴 패널 닫기
 */
FolderAccordionMenu.prototype.closeSubMenuAt=function(index, animation){
    var $item = this._$mainMenuItems.eq(index);
    this.closeSubMenu($item, animation);
}

/*
 * step #02-05
 * index 메뉴의 서브 메뉴 패널 열기
 */
FolderAccordionMenu.prototype.openSubMenuAt=function(index, animation){
    var $item = this._$mainMenuItems.eq(index);
    this.openSubMenu($item, animation);
}

/*
 * step #03
 * 서브 메뉴 아이템 선택 
 */
FolderAccordionMenu.prototype._selectSubMenuItem=function($item){
    
    var $oldItem = this._$selectSubItem; 
        
    if(this._$selectSubItem != null){
        this._$selectSubItem.removeClass("select");
    }
    
    this._$selectSubItem = $item;
    this._$selectSubItem.addClass("select");
    
    // step #05-02
    // 선택 이벤트 발생
    this._dispatchSelectEvent($oldItem, this._$selectSubItem);
}

/* 
 * step #04
 * 메뉴 선택 기능 
 * @mainIndex : 메인 메뉴 아이템 index
 * @subIndex : 서브 메뉴 아이템 index
 * @animation : 애니메이션 실행 유무 
 */
FolderAccordionMenu.prototype.selectMenu=function(mainIndex,subIndex, animation){
    
    // 메인 메뉴 아이템 
    var $item = this._$mainMenuItems.eq(mainIndex);
    // 서브 메뉴 아이템
    var $subMenuItem = $item.find(".sub li").eq(subIndex);
    if($subMenuItem){
        // 서브 메뉴 패널 열기
        this.openSubMenu($item, animation);
        
        // 서브 메뉴 아이템 서택
        this._selectSubMenuItem($subMenuItem);
    }
}

// step #05-01
// open, close 이벤트 발생
FolderAccordionMenu.prototype._dispatchOpenCloseEvent=function($item, eventName){
    
    var event = jQuery.Event(eventName);
    event.$target=$item;
    
    this.$accordionMenu.trigger(event);
}

// step #05-02
// select 이벤트 발생
FolderAccordionMenu.prototype._dispatchSelectEvent=function($oldItem, $newItem){
    
    var event = jQuery.Event("select");
    event.$oldItem = $oldItem;
    event.$newItem = $newItem;
    
    this.$accordionMenu.trigger(event);
}
