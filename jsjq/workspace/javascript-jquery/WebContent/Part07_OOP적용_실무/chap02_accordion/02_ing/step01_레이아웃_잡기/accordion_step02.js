
//폴더 아코디언 기능을 담을 FolderAccordionMenu 클래스
function FolderAccordionMenu(selector){
	//내부에서 사용하는 변수는 반드시 생성자에 선언한 후 사용!!
	this.$accordionMenu = null;
	this.$mainMenuItems = null;
	
	this.init(selector);
	this.initSubMenuPanel(selector);
}

/*
 * 요소 초기화
 */
FolderAccordionMenu.prototype.init =function(selector){
	this.$accordionMenu = $(selector);
	this.$mainMenuItems = this.$accordionMenu.children("li");
}

/*
 * 폴더 상태 설정
 */
FolderAccordionMenu.prototype.setFolderState = function($item,state){
	var $folder = $item.find(".main-title .folder");
	//기존 클래스를 모두 제거
	$folder.removeClass();
	$folder.addClass("folder " + state);
	
}

/*
 * 서브 패널 초기화 - 초기 시작 시 닫힌 상태로 만들기
 */
FolderAccordionMenu.prototype.initSubMenuPanel = function(){
	var objThis = this;
	
	this.$mainMenuItems.each(function(index){
		var $item = $(this);
		var $subMenu = $item.find(".sub");
		
		//서브가 없는 경우
		if($subMenu.length == 0){
			$item.attr("data-extension","empty");
			objThis.setFolderState($item,"empty");
		}else{
			if($item.attr("data-extension") == "open"){
				//objThis.setFolderState($item,"open");
				objThis.openSubMenu($item);
			}else{ //서브메뉴가 있는데 open이 아닌 경우는  close라 간주  
				//$item.attr("data-extension","close")
				//objThis.setFolderState($item,"close");
				objThis.closeSubMenu($item);
			}
			
		}
		
	})
}


/* 
 * 서브 메뉴 패널 열기
 */
FolderAccordionMenu.prototype.openSubMenu = function($item){
	if($item!=null){
		$item.attr("data-extension","open");
		var $subMenu = $item.find(".sub");
		$subMenu.css({ 
			marginTop : 0 //-> 서브메뉴패널이 화면에서 보이게 만든다.
		})
		//폴더 상태를 open상태로 만들기(폴더 아이콘 변경)
		this.setFolderState($item,"open");
	}
}

/*
 * 서브 메뉴 패널 닫기
 */
FolderAccordionMenu.prototype.closeSubMenu = function($item){
	if($item != null){
		$item.attr("data-extension","close");
		var $subMenu = $item.find(".sub");
		$subMenu.css({ 
			marginTop : -($subMenu.outerHeight(true)) 
			//-> 서브메뉴패널의 마진까지 포함한 높이값을 대입해 화면에서 사라지게 만든다.
		})
		//폴더 상태를 close상태로 만들기(폴더 아이콘 변경)
		this.setFolderState($item,"close");
	}
	
}

