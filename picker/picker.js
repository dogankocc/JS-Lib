var monthNames = [
    "Ocak", "Şubat", "Mart",
    "Nisan", "Mayıs", "Haziran", "Temmuz",
    "Ağustos", "Eylül", "Ekim",
    "Kasım", "Aralık"
];

function getUid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}



const handleChangeSearchText = function (event, dropdownContentId, url, method, async, colNames, colTitles, selectedItemColIndex, inputId, displayItemColIndex, parentId) {
    var searchText = (event.currentTarget.value);
    if (this.timeId)
        clearTimeout(this.timeId)
    var dropdownContent = document.getElementById(dropdownContentId);
    searchText = searchText.trim();
    if (searchText.length > 3) {
        this.timeId = setTimeout(() => {
            var async_ = true, method_ = "GET";
            if (async) async_ = async;
            if (method) method_ = method;
            colNames = colNames.split(",");
            colTitles = colTitles.split(",");
            $.ajax({
                url: url,
                dataType: 'json',
                type: method_,
                async: async_,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ searchText: searchText }),
                success: function (data, textStatus, jQxhr) {
                    var rows = JSON.parse(JSON.stringify(data));
                    var doms = '', headerDom = "";

                    doms += '<table class="menu-list">';
                    doms += '<tr class="menu-list-head">';
                    for (var j = 0; j < colNames.length; j++) {
                        headerDom += '<th class="menu-list-item-col">' + colTitles[j] + '</th>';
                    }
                    headerDom += '</tr>';
                    doms += headerDom;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var rowData = Object.values(row);
                        //var rowData = Object.values(row)[0];
                        doms += '<tr class="menu-list-item" onclick = "handleClickItem(event,\'' + i + '\',\'' + selectedItemColIndex + '\',\'' + rowData.join(",") + '\',\'' + inputId + '\',\'' + displayItemColIndex + '\')">';
                        for (var c = 0; c < colNames.length; c++) {
                            var rowData = rows[i][colNames[c]];
                            if(!rowData) rowData = "-";
                            if (typeof (rowData) === "string" && rowData.includes("/Date(")) {
                                rowData = rowData.substring(rowData.indexOf("(") + 1, rowData.indexOf(")"));
                                rowData = Number(rowData);
                                var microTime = rowData / 10000;
                                rowData = new Date(microTime);
                                rowData = rowData.getDate() + "/" + monthNames[rowData.getMonth()] + "/" + rowData.getFullYear();
                                console.log(rowData)
                            }

                            doms += '<td class="menu-list-item-col">' + rowData + '</td>';
                        }
                        doms += '</tr>';
                    }
                    doms += '</table>';

                    dropdownContent.innerHTML = ''
                    dropdownContent.innerHTML = doms;

                    dropdownContent.classList.add('show-dropdown');
                    document.getElementById(parentId).style.zIndex = 9999;
                    

                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });

        }, 2000);


    } else {
        dropdownContent.classList.remove('show-dropdown');
        document.getElementById(parentId).setAttribute("style", "z-index:0;");
    }
}


const handleClickItem = (event, i, selectedItemColIndex, rowData, inputId, displayItemColIndex) => {
    rowData = rowData.split(",");
    getSelectedItemCol(rowData[Number(selectedItemColIndex)]);
    var iVal = "";
    /*
    colNames.map((col, iCol) => { 
        var rowData = rows[Number(i)][col];
        if (typeof (rowData) === "string" && rowData.includes("/Date(")) {
            rowData = rowData.substring(rowData.indexOf("(") + 1, rowData.indexOf(")"));
            rowData = Number(rowData);
            var microTime = rowData / 10000;
            rowData = new Date(microTime);
            rowData = rowData.getDate() + "/" + monthNames[rowData.getMonth()] + "/" + rowData.getFullYear();
        }   
        iVal += rowData;
        if(colNames.length -1 !== iCol) iVal+= " ";
    });*/
    document.getElementById(inputId).value = rowData[Number(displayItemColIndex)];
}


var Picker = function (data) 
{
    if(!data || !data.columns || data.length === 0) return;
    var self = this;
    self.colNames = [];
    self.rows = null;
    self.DATA = data;
    self.colTitles = [];
    self.pickerUid = 'picker_'+getUid();
    self.inputId = 'picker_input_'+getUid();
    self.dropdownContentId = "dropdown-content-"+getUid();
    self.url = data.url;
    self.method = data.method;
    self.async = data.async;
    self.menuClassName = "" ,self.menuStyle = "" ,self.inputClassName = "" ,self.inputStyle = "" ,self.label = "";
    if(data.menuProps ){
        if(data.menuProps.className)
            self.menuClassName = data.menuProps.className;
        if(data.menuProps.style)
            self.menuStyle = data.menuProps.style;
    }
    if(data.inputProps){
        if(data.inputProps.id){
            self.inputId = data.inputProps.id
        }
        if(data.inputProps.className){
            self.inputClassName = data.inputProps.className
        }
        if(data.inputProps.style){
            self.inputStyle = data.inputProps.style
        }
    }
    if(data.label){
        self.label = data.label;
    }
 
    self.colNames=[];
    self.colTitles=[];
    for(var i=0;i<data.columns.length;i++){
        self.colNames.push(data.columns[i].colName);
        self.colTitles.push(data.columns[i].title);
    }

    self.windowClickListener = function (event) {
        var dropdownContent = document.getElementById(self.dropdownContentId);
        if (event.target.id === self.inputId) {
            return
        }
        dropdownContent.classList.remove('show-dropdown');
        document.getElementById(self.DATA.parentId).setAttribute("style", "z-index:0;");
    }

    self.Create = function() {
        var displayItemColIndex = 0;
        var selectedItemColIndex = 0;
        if (self.DATA.onChangeProps && self.DATA.onChangeProps.setDisplayItemColIndex && self.DATA.onChangeProps.selectedItemColIndex) {
            displayItemColIndex = self.DATA.onChangeProps.setDisplayItemColIndex;
            selectedItemColIndex = self.DATA.onChangeProps.selectedItemColIndex;
        }
        var domStr = '<input id="' + self.inputId + '"type="text" autocomplete="off" style="' + self.inputStyle + '" class="form-control ' + self.inputClassName + '" onkeyup="handleChangeSearchText(event,\'' + self.dropdownContentId + '\',\'' + self.url + '\',\'' + self.method + '\',\'' + self.async + '\',\'' + self.colNames.join(",") + '\',\'' + self.colTitles.join(",") + '\',\'' + selectedItemColIndex + '\',\'' + self.inputId + '\',\'' + displayItemColIndex + '\',\'' + self.DATA.parentId + '\')"/>' +
            '<label for="'+self.inputId+'">'+ self.label+'</label>'+
             '<div id="' + self.dropdownContentId+'" class="dropdown-content '+self.menuClassName+'" style="'+self.menuStyle+'"></div>';

        document.addEventListener("click",self.windowClickListener);

        if(data.parentId){
            document.getElementById(data.parentId).innerHTML = domStr;
        
            return
        }
        return {
            DOMSTR:domStr
        }
    }

}

/**
            <div id="formGroupTest" class="form-group">
                <script>
                             function getSelectedItemId(Id){
                             }
                             var picker = new Picker({
                                 method:'POST',
                                 url:"https://localhost/Synergy/Home/SearchPatients",
                                 parentId: "formGroupTest",
                                 label:'TEST',
                                 onChangeProps:{
                                    getSelectedItemCol : getSelectedItemId,
                                    selectedItemCol : "PatientID"
                                 },
                                 columns:[{colName:"PatientName",title:"HASTA ADI"},{colName:"PatientID",title:"HASTA ID"},{colName:"BoD",title:"DOĞUM TARİHİ"},{colName:"FName",title:"BABA ADI"}],
                                 menuProps:{
                                     style:""
                                 }
                             }).Create()
                </script>
            </div>
            <script src="~/Scripts/CustomLibrary/Picker/picker.js" type="text/javascript"></script>
            <link href="~/Scripts/CustomLibrary/Picker/picker-style.css" type="text/css" rel="stylesheet"/>
 * */