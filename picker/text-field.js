

function getUid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function handleFocus(event,inputId,labelId,legendId,fieldsetId,containerId){
    var inputValue = document.getElementById(inputId).value;
    var fieldset = document.getElementById(fieldsetId);
    var label = document.getElementById(labelId);
    if(fieldset) fieldset.classList.add("MuiFocused");//outlined ise
    else document.getElementById(inputId).classList.add("MuiFocused-underline");
    label.classList.add("MuiFocusedText")
    document.getElementById(containerId).classList.add("MuiFocused")
    document.getElementById(inputId).classList.add("MuiFocusedText")
    if(inputValue.length === 0){
        label.classList.toggle("MuiInputLabel-shrink")
        var legend = document.getElementById(legendId);
        if(legend) legend.classList.toggle("jss608");
    }
}   

function handleOnFocusOut(event,inputId,labelId,legendId,fieldsetId,containerId){
    var inputValue = document.getElementById(inputId).value;
    var fieldset = document.getElementById(fieldsetId);
    var label = document.getElementById(labelId);
    if(fieldset) fieldset.classList.remove("MuiFocused");
    else document.getElementById(inputId).classList.remove("MuiFocused-underline");
    label.classList.remove("MuiFocusedText")
    document.getElementById(containerId).classList.remove("MuiFocused")
    document.getElementById(inputId).classList.remove("MuiFocusedText")

    if(inputValue.length === 0){
        label.classList.toggle("MuiInputLabel-shrink")
        var legend = document.getElementById(legendId);
        if(legend) legend.classList.toggle("jss608");
    }
}

const handleClickItem = function (event, i, selectedItemColIndex, rowData, inputId, displayItemColIndex){
    rowData = rowData.split(",");
    getSelectedItemCol(rowData[Number(selectedItemColIndex)]);
    if(displayItemColIndex){
        alert("inputId  "+inputId + "   "+JSON.stringify(rowData))
        document.getElementById(inputId).value = rowData[displayItemColIndex];
    }else{/*
        var iVal = "";
        colNames.map((col,iCol) => { 
            iVal+= rows[Number(i)][col];
            if(colNames.length -1 !== iCol) iVal+= " ";
        });
        document.getElementById(self.inputID).value = iVal;*/
    }

}

function TextField(DATA)
{   
    var self = this;
    self.inputID = null, this.LABELWIDTH = null, this.LABELTEXT = null, this.PARENT_ID = null, this.SIZE = null, this.SIZE_LABEL = null, this.onChange = null;
    this.inputStyles = ""; this.inputClasses = ""; this.labelClasses = ""; this.containerClasses = "";

    if(DATA.outlined){
        this.inputClasses = "MuiInputBase-input MuiOutlinedInput-input";
        this.labelClasses = "MuiInputLabel-outlined MuiInputLabel-animated MuiInputLabel-formControl MuiFormLabel-root MuiInputLabel-root";
        this.containerClasses = "MuiInputBase-root MuiOutlinedInput-root";
     }else{
        this.inputClasses = "MuiInputBase-input MuiInput-input MuiUnderlineInput-input";
        this.labelClasses = "MuiInputLabel-underline MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiFormLabel-filled";
        this.containerClasses = "MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl";
     }
    if(DATA.picker) pickerData = DATA.pickerData;
    if(DATA.id) self.inputID = DATA.id;
    else self.inputID = "input-"+getUid();
    if(DATA.labelWidth) this.LABELWIDTH = DATA.labelWidth;
    else this.LABELWIDTH = 100;
    if(DATA.label) this.LABELTEXT = DATA.label;
    else this.LABELTEXT = "";
    if(DATA.onChange) this.onChange = DATA.onChange;
    if(DATA.size === "small"){this.SIZE_LABEL = "MuiInputLabel-marginDense";this.SIZE = "MuiOutlinedInput-inputMarginDense";} 
    else {this.SIZE ="";this.SIZE_LABEL =""}
    if(DATA.parentId) this.PARENT_ID = DATA.parentId;
    if(DATA.inputProps && DATA.inputProps.style) this.inputStyles = DATA.inputProps.style;
    if(DATA.width) this.width = (DATA.width).toString();
    else this.width = "100%";

    this.labelID = "label-"+getUid();
    this.spanID = "span-"+getUid();
    this.legendID = "legend-"+getUid();
    this.containerID = "container-"+getUid();
    this.fieldsetID = "fieldset-"+getUid();
    self.rows = [];
    if(DATA.picker && DATA.picker.rows)  self.rows =  DATA.picker.rows;
    
    self.colNames=[];
    self.colTitles=[];
    if(DATA.picker && DATA.picker.columns)
    for(var i=0;i<DATA.picker.columns.length;i++){
        this.colNames.push(DATA.picker.columns[i].colName);
        this.colTitles.push(DATA.picker.columns[i].title);
    }
    self.dropdownContentID = "";
    if(DATA.picker && DATA.picker.onChangeProps && DATA.picker.onChangeProps.displayItemColIndex)
    self.displayItemColIndex = DATA.picker.onChangeProps.displayItemColIndex;
    else self.displayItemColIndex = 0;

    if(DATA.picker && DATA.picker.onChangeProps && DATA.picker.onChangeProps.selectedItemColIndex)
    self.selectedItemColIndex = DATA.picker.onChangeProps.selectedItemColIndex;
    else self.selectedItemColIndex = 0;


    this.windowClickListener = function (event){
        var dropdownContent = document.getElementById(self.dropdownContentID);
        if(event.target.id === self.inputID ){
            return
        }
        document.getElementById(DATA.parentId).style.zIndex = 0;
        dropdownContent.classList.remove('show-dropdown')
    }

    this.handleChangeSearchText = function (event){
        var searchText = (event.currentTarget.value);
        if(this.timeId) clearTimeout(this.timeId);
        var dropdownContent = document.getElementById(self.dropdownContentID);
        if(searchText.length > 3){
                this.timeId = setTimeout(()=>{ 
                    var async_ = true ,method_ = "GET";
                    if(DATA.async && DATA.method && DATA.url){
                        async_ = DATA.async;
                        method_ = DATA.method;
                        var request = new XMLHttpRequest();
                        request.open(method_,DATA.url, async_);
                        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                        request.setRequestHeader('Access-Control-Allow-Origin', '*');
                        request.setRequestHeader('Accept', '*/*');        
                        request.send(JSON.stringify({searchText:searchText}));
                        request.onreadystatechange = () =>{
                            if (request.readyState === 4 ) {
                                if(JSON.parse(request.responseText).length){
                                    self.rows = JSON.parse(request.responseText);
                                    var doms = '' ,headerDom = "";
                                    doms += '<table class="menu-list">';
                                    doms += '<tr class="menu-list-head">';
                                    for(var j = 0; j < self.colNames.length; j++){
                                        headerDom+='<th class="menu-list-item-col">'+self.colTitles[j]+'</th>';
                                    }
                                    headerDom+='</tr>';
                                    doms += headerDom;
                                    for(var i=0;i<self.rows.length;i++){
                                        var row = self.rows[i];
                                        var rowData = Object.values(row);
                                        doms += '<tr class="menu-list-item" onclick = "handleClickItem(event,\'' + i + '\',\'' + self.selectedItemColIndex + '\',\'' + rowData.join(",") + '\',\'' + self.inputID + '\',\'' + self.displayItemColIndex + '\')">';
                                        for (var c = 0; c < self.colNames.length; c++){
                                            var rowData = self.rows[i][self.colNames[c]];
                                            doms += '<td class="menu-list-item-col">' + rowData +'</td>';
                                        }
                                        doms+= '</tr>';
                                    }
                                    doms += '</table>';
        
                                    dropdownContent.innerHTML = ''
                                    dropdownContent.innerHTML = doms;
                                    dropdownContent.classList.add('show-dropdown');
                                    document.getElementById(DATA.parentId).style.zIndex = 9999;
                                    
                                } 
                            }
                        }
                    }else{
                        var doms = '' ,headerDom = "";
           
                        doms += '<table class="menu-list">';
                
                        doms += '<tr class="menu-list-head">';
                        for(var j = 0; j < self.colNames.length; j++){
                            headerDom+='<th class="menu-list-item-col">'+self.colTitles[j]+'</th>';
                        }
                        headerDom+='</tr>';
                        doms += headerDom;
                        for(var i=0;i<self.rows.length;i++){
                            var row = self.rows[i];
                            var rowData = Object.values(row);
                            doms += '<tr class="menu-list-item" onclick = "handleClickItem(event,\'' + i + '\',\'' + self.selectedItemColIndex + '\',\'' + rowData.join(",") + '\',\'' + self.inputID + '\',\'' + self.displayItemColIndex + '\')">';
                            for (var c = 0; c < self.colNames.length; c++){
                                var rowData = self.rows[i][self.colNames[c]];
                                doms += '<td class="menu-list-item-col">' + rowData +'</td>';
                            }
                            doms+= '</tr>';
                        }
                        doms += '</table>';
                
                        dropdownContent.innerHTML = ''
                        dropdownContent.innerHTML = doms;
            
                        dropdownContent.classList.add('show-dropdown')
                        document.getElementById(DATA.parentId).style.zIndex = 9999;
                    }

        
                }, 2000);
          
                


            
        }else{
            dropdownContent.classList.remove('show-dropdown');
            document.getElementById(DATA.parentId).style.zIndex = 0;
        }
    }
    
    this.Create = ()=>{
        var dom = "";
        var containerDom = "";
        if(!DATA.picker)
        {      
            if(DATA.outlined){
                containerDom =  '<input id="'+self.inputID+'" type="text" style="'+this.inputStyles+'" class="'+ this.inputClasses +' '+this.SIZE+' " value="" onfocusout="handleOnFocusOut(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'(event)">'+
                '<fieldset id="'+this.fieldsetID+'" aria-hidden="true" class="jss605 MuiOutlinedInput-notchedOutline">'+
                    '<legend id="'+this.legendID+'" class="jss607">'+
                        '<span id="'+this.spanID+'">'+this.LABELTEXT +'</span>'+
                    '</legend>'+
                '</fieldset>';
            }else{
                containerDom = '<input aria-invalid="false" id="'+self.inputID+'" type="text" style="'+this.inputStyles+'" class="'+ this.inputClasses +' '+this.SIZE+' " value=""  onfocusout="handleOnFocusOut(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'(event)">';
            }
            dom = '<div class="MuiFormControl-root MuiTextField-root jss548">'+
            '<label  id="'+this.labelID+'" class="'+this.labelClasses+' '+this.SIZE_LABEL+'" data-shrink="false" for="'+self.inputID+'">'+this.LABELTEXT+'</label>'+
            '<div id="'+this.containerID+'" class="'+this.containerClasses+'">'+
                containerDom
                '</div>'+
            '</div>';   
        }
        else
        {
            self.dropdownContentID = "dropdown-content-"+getUid();
            var menuStyle = "";
            if(DATA.picker.menuProps) menuStyle = DATA.picker.menuProps.style;

            if(DATA.outlined){
                containerDom =  '<input id="'+self.inputID+'" type="text" style="'+this.inputStyles+'" class="'+ this.inputClasses +' '+this.SIZE+' " value="" onfocusout="handleOnFocusOut(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'(event)">'+
                '<fieldset id="'+this.fieldsetID+'" aria-hidden="true" class="jss605 MuiOutlinedInput-notchedOutline">'+
                    '<legend id="'+this.legendID+'" class="jss607">'+
                        '<span id="'+this.spanID+'">'+this.LABELTEXT +'</span>'+
                    '</legend>'+
                '</fieldset>';
            }else{
                containerDom = '<input aria-invalid="false" id="'+self.inputID+'" type="text" style="'+this.inputStyles+'" class="'+ this.inputClasses +' '+this.SIZE+' " value=""  onfocusout="handleOnFocusOut(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+self.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'(event)">';
            }
            dom =  '<div class="MuiFormControl-root MuiTextField-root jss548">'+
            '<label  id="'+this.labelID+'" class="'+this.labelClasses+' '+this.SIZE_LABEL+'" data-shrink="false" for="'+self.inputID+'">'+this.LABELTEXT+'</label>'+
            '<div id="'+this.containerID+'" class="'+this.containerClasses+'">'+
                containerDom+
                '</div>'+
            '</div>'+
            '<div id="'+self.dropdownContentID+'" class="dropdown-content" style="'+menuStyle+'"></div>';

            document.addEventListener("click",this.windowClickListener);
        }

        if(this.PARENT_ID){
            document.getElementById(this.PARENT_ID).innerHTML = dom;
            document.getElementById(self.inputID).addEventListener("keyup",this.handleChangeSearchText);
            return 
        }
        return dom

    }

    this.Destroy = () =>{
        document.removeEventListener("click",this.windowClickListener);
    }
}


/**
 * 
 *     var containerDom = "";

            if(DATA.outlined){
                containerDom =  '<input id="'+this.inputID+'" type="text"  class="'+ this.inputClasses +' '+this.SIZE+' " value="" onfocusout="handleOnFocusOut(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'">'+
                '<fieldset id="'+this.fieldsetID+'" aria-hidden="true" class="jss605 MuiOutlinedInput-notchedOutline">'+
                    '<legend id="'+this.legendID+'" class="jss607">'+
                        '<span id="'+this.spanID+'">'+this.LABELTEXT +'</span>'+
                    '</legend>'+
                '</fieldset>';
            }else{
                containerDom = '<input aria-invalid="false" id="'+this.inputID+'" type="text" class="MuiInputBase-input MuiInput-input" value=""  onfocusout="handleOnFocusOut(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onfocus="handleFocus(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" onkeyup="'+this.onChange+'">';
            }
 */


 /*
            dom =  '<div id="'+pickerId +'" class="dropdown">'+
            '<div class="MuiFormControl-root MuiTextField-root jss548">'+
            '<label  id="'+this.labelID+'" class="MuiInputLabel-outlined MuiInputLabel-animated MuiInputLabel-formControl MuiFormLabel-root MuiInputLabel-root '+this.SIZE_LABEL+'" data-shrink="false" for="outlined-basic">'+this.LABELTEXT+'</label>'+
            '<div id="'+this.containerID+'" class="MuiInputBase-root MuiOutlinedInput-root">'+
                '<input id="'+this.inputID+'" type="text" class="MuiInputBase-input MuiOutlinedInput-input '+this.SIZE+'" '+
                'value="" onfocusout="handleOnFocusOut(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" '+
                'onfocus="handleFocus(event,\''+this.inputID+'\',\''+this.labelID+'\',\''+this.legendID+'\',\''+this.fieldsetID+'\',\''+this.containerID+'\')" '+
                'onkeyup="handleChangeSearchText(event)">'+
                '<fieldset id="'+this.fieldsetID+'" aria-hidden="true" class="jss605 MuiOutlinedInput-notchedOutline">'+
                    '<legend id="'+this.legendID+'" class="jss607">'+
                        '<span id="'+this.spanID+'">'+this.LABELTEXT +'</span>'+
                    '</legend>'+
                '</fieldset>'+
                '</div>'+
            '</div>'+
            '<div id="'+dropdownContentID+'" class="dropdown-content" style="'+DATA.picker.menuStyle+'"></div>'+
            '</div>';
*/

