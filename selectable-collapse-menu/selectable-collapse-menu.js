
function getUid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function setSubItems(parentSpanId, displayColName, method, async, url, selfID) {
    var self = this;
    if (self.openedItemId && self.subListId ) {
        var openedItemEl = document.getElementById(self.openedItemId);
        openedItemEl.removeChild(document.getElementById(self.subListId));
        self.openedItemId = null;
        self.subListId = null;
        return;
    }
    var method_ = "GET", async_ = true;
    if (method.length > 0) method_ = method;
    if (async === "false") async_ = false;
    var span = document.getElementById(parentSpanId);
    var compareText = span.previousElementSibling.id;
    var displayText = displayColName.split(",");

    var request = new XMLHttpRequest();
    request.open(method_, url, async_);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Accept', '*/*');
    request.send(JSON.stringify({ searchText: compareText }));

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            var subItems = JSON.parse(request.responseText);
            var doms = '<ul id="subList-' + selfID + '" class="subList">';
            for (var i = 0; i < subItems.length; i++) {
                var spanStr = '';
                for (var x = 0; x < displayText.length; x++) {
                    spanStr += '<span  id="' + selfID + '-subItem-span-' + i + '" class="subItem-span-' + selfID + ' subSpan">' + subItems[i][displayText[x]] + '</span>';
                } 
                doms += '<li id="' + selfID + '-subItem-' + i + '" class="subItems" ><div class="d-flex"><label class="checkbox-container"><input type="checkbox" checked="checked"><span class="checkmark"></span></label>' + spanStr + '</div></li>';
            }
            doms += "</ul>";

            self.openedItemId = span.parentNode.id;
            self.subListId = 'subList-' + selfID;
            span.parentNode.innerHTML += doms;


        }
    }

}

function SelectableCollapseList(data){
    var self = this;
    self.id ="list-"+getUid();
    if(data.id) self.id = data.id;
    self.DATA = data;
    self.Create = function () {        
            var method_ = "GET" ,async_ = true;
            if(self.DATA.parentItemsProps && self.DATA.parentItemsProps.method) method_ = self.DATA.parentItemsProps.method;
            if (self.DATA.parentItemsProps && self.DATA.parentItemsProps.async) async_ = self.DATA.parentItemsProps.async;
            var request = new XMLHttpRequest();
            request.open(method_, self.DATA.parentItemsProps.url, async_);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Accept', '*/*');
            request.send();
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    var rows = JSON.parse((request.responseText));
                    var doms = '<ul id="' + self.id + '" class="selectableCollapseList">';
                    for (var i = 0; i < rows.length; i++) {
                        doms += '<li id="' + self.id + '-parentItem-' + i + '" class="parentItems" ><div id="' + rows[i][self.DATA.subItemsProps.compareParentItemColname] + '" style="display:none;"></div>' +
                            '<span onclick="setSubItems(\'' + self.id + '-parentItem-span-' + i + '\',\'' + data.subItemsProps.displayColName + '\',\'' + data.subItemsProps.method + '\',\'' + data.subItemsProps.async + '\',\'' + data.subItemsProps.url + '\',\'' + self.id + '\')" id="' + self.id + '-parentItem-span-' + i + '" class="parentSpan parentItem-span-' + self.id + ' caret">' + rows[i][self.DATA.parentItemsProps.displayColName] + '</span></li>';
                    }
                    doms += "</ul>";
                    document.getElementById(self.DATA.parentId).innerHTML = doms;
                }
            }   

    }
}


/**
<link href="~/Content/selectable-collapse-list.css" type="text/css" rel="stylesheet" />
<script src="~/Scripts/CustomLibrary/List/selectable-collapse-list.js"></script>
<div id="selectable-collapse-example">
    <script>
            var List = new SelectableCollapseList({
                id:"selectableCollapselistExample",
                parentId:"selectable-collapse-example",
                parentItemsProps:{
                    url:'https://localhost/Synergy/Home/GetItemsForSelectableCollapseList',
                    displayColName : "DN"

                },
                subItemsProps:{
                    url:'https://localhost/Synergy/Home/GetSubItemForSelectableCollapseList',
                    method:'POST',
                    async:true,
                    displayColName : "UserName,JT",
                    compareParentItemColname : "DI"
                },

            }).Create()
    </script>
</div>
 * */

